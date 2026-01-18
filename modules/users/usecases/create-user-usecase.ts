import type { UserEntity, UserRepository } from '../repositories/user-repository'

export type CreateUserRequest = {
  email: string
  name?: string
}

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Email already in use')
  }
}

export class InvalidEmailError extends Error {
  constructor() {
    super('Invalid email')
  }
}

export class CreateUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    const email = request.email.trim().toLowerCase()

    if (!this.isValidEmail(email)) {
      throw new InvalidEmailError()
    }

    const existing = await this.users.findByEmail(email)
    if (existing) {
      throw new EmailAlreadyInUseError()
    }

    return this.users.create({
      email,
      name: request.name?.trim() ? request.name.trim() : null,
    })
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
