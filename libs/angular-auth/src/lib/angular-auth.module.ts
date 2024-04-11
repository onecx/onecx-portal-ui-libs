import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

export interface AngularAuthModuleConfig {
  tokenInterceptorWhitelist?: string[]
}

@NgModule({
  imports: [CommonModule],
})
export class AngularAuthModule {}
