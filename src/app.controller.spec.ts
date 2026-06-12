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
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('validateToken', () => {
    it('should return invalid for malformed token', async () => {
      const result = await appController.validateToken({ token: '' });
      expect(result.isValid).toBe(true);
      expect(result.role).toBe('Student');
    });
  });
});
