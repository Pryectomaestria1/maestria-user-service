import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UserService } from './user.service';

describe('AppController', () => {
  let appController: AppController;

  const mockUserService = {
    getRole: jest.fn(),
    saveRole: jest.fn(),
    getProfilesByIds: jest.fn(),
    saveProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getRole', () => {
    it('should return empty role when no override exists', async () => {
      mockUserService.getRole.mockResolvedValue(null);
      const result = await appController.getRole({ userId: 'auth0|abc' });
      expect(result.role).toBe('');
    });
  });

  describe('setUserRole', () => {
    it('should persist Instructor override', async () => {
      mockUserService.saveRole.mockResolvedValue({ userId: 'auth0|abc', role: 'Instructor' });
      const result = await appController.setUserRole({ userId: 'auth0|abc', role: 'Instructor' });
      expect(result).toEqual({ success: true, role: 'Instructor' });
      expect(mockUserService.saveRole).toHaveBeenCalledWith('auth0|abc', 'Instructor');
    });

    it('should reject invalid role with RpcException', async () => {
      await expect(
        appController.setUserRole({ userId: 'auth0|abc', role: 'Admin' }),
      ).rejects.toBeInstanceOf(Error);
      expect(mockUserService.saveRole).not.toHaveBeenCalled();
    });
  });
});
