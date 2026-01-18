export type CreateUserInput = {
  email: string
  name?: string | null
}

export type UserEntity = {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>
  create(data: CreateUserInput): Promise<UserEntity>
}
