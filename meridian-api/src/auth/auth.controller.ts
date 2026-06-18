import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from 'src/DTO/signin-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { LogoutDto } from './dto/logout.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from './guard/access-token/access-token.guard';
import { REQUEST_USER_KEY } from './constant/auth-constant';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @Throttle({ default: { limit: 5, ttl: 15000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with user credentials' })
  @ApiResponse({
    status: 200,
    description:
      'Successfully authenticated, returns access token and refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid credentials',
  })
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.SignIn(signInDto);
  }

  @Post('/refresh-token')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Auth Token' })
  @ApiResponse({ status: 200, description: 'Successfully refreshed token' })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Limit 10 attempts per minute',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid refresh token',
  })
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
  ) {
    const userAgent = req.get('user-agent') ?? undefined;
    return this.authService.RefreshToken(refreshTokenDto, userAgent);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke the current refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully revoked refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid refresh token',
  })
  public async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post('/logout-all')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all refresh tokens for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully revoked all sessions',
  })
  public async logoutAll(@Req() req: Request) {
    const user = req[REQUEST_USER_KEY] as { sub?: string | number };
    const userId = Number(user?.sub);

    if (!Number.isFinite(userId)) {
      throw new Error('Invalid user payload');
    }

    return this.authService.logoutAll(userId);
  }
}
