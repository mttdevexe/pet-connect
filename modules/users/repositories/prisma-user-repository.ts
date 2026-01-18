import { prisma } from '@/lib/prisma'

import type { CreateUserInput, UserEntity, UserRepository } from './user-repository'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
      },
    })
  }
}
