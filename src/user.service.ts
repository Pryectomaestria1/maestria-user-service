import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getRole(userId: string): Promise<string | null> {
    const record = await this.userRole.findUnique({ where: { userId } });
    return record?.role ?? null;
  }

  async saveRole(userId: string, role: string) {
    return this.userRole.upsert({
      where: { userId },
      create: { userId, role },
      update: { role },
    });
  }

  async getProfilesByIds(userIds: string[]) {
    return this.userProfile.findMany({
      where: { userId: { in: userIds } },
    });
  }

  async saveProfile(userId: string, name: string, avatarUrl: string) {
    return this.userProfile.upsert({
      where: { userId },
      create: { userId, name, avatarUrl },
      update: { name, avatarUrl },
    });
  }
}
