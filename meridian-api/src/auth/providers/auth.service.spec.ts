// Mock all transitive src/-aliased paths that Jest can't resolve
jest.mock(
  'src/users/providers/user-auth.facade',
  () => ({ UserAuthFacade: class UserAuthFacade {} }),
  { virtual: true },
);
jest.mock(
  'src/users/providers/user.services',
  () => ({ UserService: class UserService {} }),
  { virtual: true },
);
jest.mock('src/DTO/signin-dto', () => ({}), { virtual: true });
jest.mock('./hashing', () => ({ HashingProvider: class HashingProvider {} }), {
  virtual: true,
});
jest.mock(
  './token.provider',
  () => ({ GenerateTokenProvider: class GenerateTokenProvider {} }),
  { virtual: true },
);
jest.mock('../dto/refresh-token-dto', () => ({}), { virtual: true });

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let signInProviders: { SignIn: jest.Mock };
  let refreshTokenProvider: {
    refreshToken: jest.Mock;
    logout: jest.Mock;
    logoutAll: jest.Mock;
  };

  beforeEach(() => {
    signInProviders = { SignIn: jest.fn(async () => ({ accessToken: 'tok' })) };
    refreshTokenProvider = {
      refreshToken: jest.fn(async () => ({ accessToken: 'new-tok' })),
      logout: jest.fn(async () => ({ success: true })),
      logoutAll: jest.fn(async () => ({ success: true })),
    };

    service = new AuthService(
      signInProviders as any,
      refreshTokenProvider as any,
    );
  });

  it('SignIn delegates to signInProviders', async () => {
    const dto = { email: 'a@b.com', password: 'pass' } as any;
    const result = await service.SignIn(dto);
    expect(signInProviders.SignIn).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ accessToken: 'tok' });
  });

  it('RefreshToken delegates to refreshTokenProvider with the DTO', async () => {
    const dto = { refreshToken: 'token' } as any;
    const result = await service.RefreshToken(dto);
    expect(refreshTokenProvider.refreshToken).toHaveBeenCalledWith(
      dto,
      undefined,
    );
    expect(result).toEqual({ accessToken: 'new-tok' });
  });

  it('logout delegates to refreshTokenProvider', async () => {
    const dto = { refreshToken: 'token' } as any;
    const result = await service.logout(dto);
    expect(refreshTokenProvider.logout).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ success: true });
  });

  it('logoutAll delegates to refreshTokenProvider', async () => {
    const userId = 1;
    const result = await service.logoutAll(userId);
    expect(refreshTokenProvider.logoutAll).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ success: true });
  });
});
