import { NextResponse } from 'next/server'

import { CreateUserController } from '@/modules/users/controllers/create-user-controller'
import { PrismaUserRepository } from '@/modules/users/repositories/prisma-user-repository'
import { CreateUserUseCase } from '@/modules/users/usecases/create-user-usecase'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const usersRepository = new PrismaUserRepository()
  const useCase = new CreateUserUseCase(usersRepository)
  const controller = new CreateUserController(useCase)

  const result = await controller.handle(body)
  return NextResponse.json(result.body, { status: result.status })
}
