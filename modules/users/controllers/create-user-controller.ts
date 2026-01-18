import {
  CreateUserUseCase,
  EmailAlreadyInUseError,
  InvalidEmailError,
} from '../usecases/create-user-usecase'

export type CreateUserControllerRequest = {
  email?: unknown
  name?: unknown
}

export type ControllerResponse<T> = {
  status: number
  body: T
}

export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(request: CreateUserControllerRequest): Promise<ControllerResponse<unknown>> {
    const email = typeof request.email === 'string' ? request.email : ''
    const name = typeof request.name === 'string' ? request.name : undefined

    try {
      const user = await this.useCase.execute({ email, name })
      return { status: 201, body: user }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')

      if (err instanceof InvalidEmailError) {
        return { status: 400, body: { message: err.message } }
      }

      if (err instanceof EmailAlreadyInUseError) {
        return { status: 409, body: { message: err.message } }
      }

      if (this.isPrismaUniqueConstraintError(err)) {
        return { status: 409, body: { message: 'Email already in use' } }
      }

      return { status: 500, body: { message: 'Internal server error', detail: error.message } }
    }
  }

  private isPrismaUniqueConstraintError(err: unknown): boolean {
    if (!err || typeof err !== 'object') return false
    return 'code' in err && (err as { code?: unknown }).code === 'P2002'
  }
}
