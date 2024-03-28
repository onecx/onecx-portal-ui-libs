import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalFooterComponent } from './components/portal-footer/portal-footer.component'
import { RouterModule } from '@angular/router'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'

@NgModule({
  imports: [CommonModule, RouterModule, AngularRemoteComponentsModule, AngularAcceleratorModule],
  declarations: [PortalViewportComponent, HeaderComponent, PortalFooterComponent],
  exports: [PortalViewportComponent, HeaderComponent, PortalFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShellCoreModule {}
