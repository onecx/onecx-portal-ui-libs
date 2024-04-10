import { AngularAuthService } from './angular-auth.service'

export class AngularAuthServiceWrapper implements AngularAuthService {
  logout(): void {
    throw new Error('Method not implemented.')
  }
  init(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  auth_header_values(): string[] {
    throw new Error('Method not implemented.')
  }
  additional_header_values(): string[] {
    throw new Error('Method not implemented.')
  }
  hasRole(_role: string): boolean {
    throw new Error('Method not implemented.')
  }
  getUserRoles(): string[] {
    throw new Error('Method not implemented.')
  }
}
