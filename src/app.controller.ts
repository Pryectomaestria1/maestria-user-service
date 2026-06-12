import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'ValidateToken')
  async validateToken(data: { token: string }) {
    try {
      const decoded: any = jwt.decode(data.token);
      const userId = decoded?.sub || '';

      const upgradedRole = userId ? await this.userService.getRole(userId) : null;
      const role =
        upgradedRole ??
        decoded?.['https://udemyclone.com/roles']?.[0] ??
        'Student';

      return {
        isValid: true,
        userId,
        role,
      };
    } catch {
      return { isValid: false, userId: '', role: '' };
    }
  }

  @GrpcMethod('UserService', 'BecomeInstructor')
  async becomeInstructor(data: { token: string }) {
    try {
      const decoded: any = jwt.decode(data.token);
      const userId = decoded?.sub || '';

      if (!userId) {
        return { success: false, role: 'Student' };
      }

      await this.userService.saveRole(userId, 'Instructor');

      return {
        success: true,
        role: 'Instructor',
      };
    } catch {
      return { success: false, role: 'Student' };
    }
  }

  @GrpcMethod('UserService', 'GetUsersByIds')
  async getUsersByIds(data: { userIds: string[] }) {
    const ids = data.userIds || [];
    const profiles = await this.userService.getProfilesByIds(ids);
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    const users = ids.map((id) => {
      const profile = profileMap.get(id);
      if (profile) {
        return {
          id,
          name: profile.name,
          avatarUrl:
            profile.avatarUrl ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`,
        };
      }

      let name = 'Usuario Demo';
      if (id.startsWith('auth0|')) {
        name = `Usuario ${id.substring(6, 12)}`;
      } else {
        name = `Usuario ${id.substring(0, 6)}`;
      }
      return {
        id,
        name,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`,
      };
    });
    return { users };
  }

  @GrpcMethod('UserService', 'SyncProfile')
  async syncProfile(data: { userId: string; name: string; avatarUrl: string }) {
    try {
      if (data.userId && data.name) {
        await this.userService.saveProfile(
          data.userId,
          data.name,
          data.avatarUrl || '',
        );
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  }
}
