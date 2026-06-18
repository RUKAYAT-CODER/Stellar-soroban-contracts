import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token-dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/users/providers/user.services';
import { GenerateTokenProvider } from './token.provider';
import { RefreshToken } from '../entities/refresh-token.entity';
import { HashingProvider } from './hashing';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,

    // jwt config injecion
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly hashingProvider: HashingProvider,

    // injecting generatetokenprovider
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(
    refreshTokendto: RefreshTokenDto,
    userAgent?: string,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokendto.refreshToken,
        {
          secret: this.jwtconfiguration.secret,
          audience: this.jwtconfiguration.audience,
          issuer: this.jwtconfiguration.issuer,
        },
      );

      const { sub, jti } = payload;
      const userId = Number(sub);

      if (!Number.isFinite(userId)) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      const user = await this.userService.findOneId(userId);

      const storedToken = await this.refreshTokenRepository.findOne({
        where: { jti, userId: user.id },
      });

      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date()
      ) {
        throw new UnauthorizedException(
          'Refresh token has been revoked or expired',
        );
      }

      const isValid = await this.hashingProvider.comparePassword(
        refreshTokendto.refreshToken,
        storedToken.tokenHash,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.refreshTokenRepository.update(
        { jti, userId: user.id },
        { revokedAt: new Date() },
      );

      const tokens = await this.generateTokenProvider.generateTokens(user);
      const newRefreshToken = await this.refreshTokenRepository.save({
        jti: tokens.jti,
        userId: user.id,
        tokenHash: await this.hashingProvider.hashPassword(
          tokens.refresh_token,
        ),
        expiresAt: new Date(Date.now() + this.jwtconfiguration.Rttl * 1000),
        revokedAt: null,
        userAgent: userAgent ?? null,
      });

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        refreshTokenId: newRefreshToken.id,
      };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : error,
      );
    }
  }

  public async logout(refreshTokendto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokendto.refreshToken,
        {
          secret: this.jwtconfiguration.secret,
          audience: this.jwtconfiguration.audience,
          issuer: this.jwtconfiguration.issuer,
        },
      );

      const { sub, jti } = payload;
      const userId = Number(sub);

      if (!Number.isFinite(userId)) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      const user = await this.userService.findOneId(userId);

      await this.refreshTokenRepository.update(
        { jti, userId: user.id },
        { revokedAt: new Date() },
      );

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : error,
      );
    }
  }

  public async logoutAll(userId: number) {
    await this.refreshTokenRepository.update(
      { userId, revokedAt: null },
      { revokedAt: new Date() },
    );

    return { message: 'All sessions revoked successfully' };
  }
}
