import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'
import { ToastModule } from 'primeng/toast'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { PortalFooterComponent } from './components/portal-footer/portal-footer.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { SkeletonModule } from 'primeng/skeleton'
import { AppLoadingSpinnerComponent } from './components/app-loading-spinner/app-loading-spinner.component'
import { ShellSrcDirective } from './directives/src.directive'
import { TranslateModule } from '@ngx-translate/core'
import { TooltipModule } from 'primeng/tooltip'

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
    PortalFooterComponent,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent,
    ShellSrcDirective,
  ],
  exports: [
    GlobalErrorComponent,
    HeaderComponent,
    PortalViewportComponent,
    PortalFooterComponent,
    ToastModule,
    TooltipModule,
    TranslateModule,
  ],
})
export class ShellCoreModule {}
