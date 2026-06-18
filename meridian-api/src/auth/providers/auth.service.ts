import { Injectable } from '@nestjs/common';
import { SignInDto } from 'src/DTO/signin-dto';
import { SignInProviders } from './sign-in.providers';
import { RefreshTokenDto } from '../dto/refresh-token-dto';
import { RefreshTokenProvider } from './refreshToken.provider';

@Injectable()
export class AuthService {
  constructor(
    //intra dependency injection of sigin Providers
    private readonly signInProviders: SignInProviders,

    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async SignIn(signInDto: SignInDto) {
    // find user in database by email
    return await this.signInProviders.SignIn(signInDto);
  }

  public async RefreshToken(
    refreshTokendto: RefreshTokenDto,
    userAgent?: string,
  ) {
    return await this.refreshTokenProvider.refreshToken(
      refreshTokendto,
      userAgent,
    );
  }

  public async logout(refreshTokendto: RefreshTokenDto) {
    return await this.refreshTokenProvider.logout(refreshTokendto);
  }

  public async logoutAll(userId: number) {
    return await this.refreshTokenProvider.logoutAll(userId);
  }
}
