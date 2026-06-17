import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from 'src/DTO/signin-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) {}

    @Post('/sign-in')
    @Throttle({ default: { limit: 5, ttl: 15000 } })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with user credentials' })
    @ApiResponse({ status: 200, description: 'Successfully authenticated, returns access token and refresh token' })
    @ApiResponse({ status: 401, description: 'Unauthorized / Invalid credentials' })
    public async signIn(@Body() signInDto:SignInDto) {
        return this.authService.SignIn(signInDto)

    }

    @Post('/refresh-token')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh Auth Token' })
    @ApiResponse({ status: 200, description: 'Successfully refreshed token' })
    @ApiResponse({ status: 429, description: 'Too Many Requests - Limit 10 attempts per minute' })
    @Get('/refresh-token')
    @ApiOperation({ summary: 'Refresh active JWT access tokens' })
    @ApiResponse({ status: 200, description: 'Successfully generated new tokens' })
    @ApiResponse({ status: 401, description: 'Unauthorized / Invalid refresh token' })
    public refreshToken(@Body() refreshTokenDto:RefreshTokenDto ) {
        return this.authService.RefreshToken(refreshTokenDto)

    }
}
