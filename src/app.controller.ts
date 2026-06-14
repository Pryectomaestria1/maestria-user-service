import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUserProfile')
  async getUserProfile(_: unknown, metadata: Metadata) {
    const userId = metadata.get('x-user-id')?.[0]?.toString();
    if (!userId) {
      throw new RpcException('INVALID_ARGUMENT: x-user-id required');
    }
    const profile = await this.userService.getProfileById(userId);
    return {
      name: profile?.name ?? '',
      avatarUrl: profile?.avatarUrl ?? '',
    };
  }

  @GrpcMethod('UserService', 'GetRole')
  async getRole(data: { userId: string }) {
    const role = await this.userService.getRole(data.userId);
    return { role: role ?? '' };
  }

  @GrpcMethod('UserService', 'SetUserRole')
  async setUserRole(data: { userId: string; role: string }) {
    if (data.role !== 'Student' && data.role !== 'Instructor') {
      throw new RpcException(
        'INVALID_ARGUMENT: role must be Student or Instructor',
      );
    }
    await this.userService.saveRole(data.userId, data.role);
    return { success: true, role: data.role };
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
}
