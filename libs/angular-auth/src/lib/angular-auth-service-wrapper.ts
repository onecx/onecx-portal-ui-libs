import { AngularAuthService } from './angular-auth.service'

export class AngularAuthServiceWrapper implements AngularAuthService {
  logout(): void {
    throw new Error('Method not implemented.')
  }
  init(): Promise<boolean> {
    // checks which service should be used
    throw new Error('Method not implemented.')
  }
  getHeaderValues(): Record<string, string> {
    throw new Error('Method not implemented.')
  }
  hasRole(_role: string): boolean {
    throw new Error('Method not implemented.')
  }
  getUserRoles(): string[] {
    throw new Error('Method not implemented.')
  }
}
