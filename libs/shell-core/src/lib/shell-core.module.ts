import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'
import { ToastModule } from 'primeng/toast'
import { providePrimeNG } from 'primeng/config'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { SkeletonModule } from 'primeng/skeleton'
import { AppLoadingSpinnerComponent } from './components/app-loading-spinner/app-loading-spinner.component'
import { ShellSrcDirective } from './directives/src.directive'
import { TranslateModule } from '@ngx-translate/core'
import { TooltipModule } from 'primeng/tooltip'
import { MessageService } from 'primeng/api'

@NgModule({
  imports: [
    AngularRemoteComponentsModule,
    CommonModule,
    RouterModule,
    SkeletonModule,
    ToastModule,
    TooltipModule,
    TranslateModule,
  ],
  declarations: [
    PortalViewportComponent,
    HeaderComponent,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent,
    ShellSrcDirective,
  ],
  exports: [
    GlobalErrorComponent,
    HeaderComponent,
    PortalViewportComponent,
    ToastModule,
    TooltipModule,
    TranslateModule,
  ],
  providers: [providePrimeNG(), { provide: MessageService, useClass: MessageService }],
})
export class ShellCoreModule {}
