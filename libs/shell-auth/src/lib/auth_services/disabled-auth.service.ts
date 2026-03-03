import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable()
export class DisabledAuthService implements AuthService {

  public async init(_config?: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(true);
  }

  getIdToken(): string | null {
    return "";
  }
  getAccessToken(): string | null {
    return "";
  }

  logout(): void {
    window.location.href = "https://github.com/onecx/";
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getHeaderValues(): Record<string, string> {
    return {};
  }
}
