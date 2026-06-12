import type { z } from 'zod'

import type {
  AuthTokensSchema,
  AuthUserSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  UserRoleSchema,
} from '../schemas/auth.schema'

export type UserRole = z.infer<typeof UserRoleSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>
export type AuthTokens = z.infer<typeof AuthTokensSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
