import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalFooterComponent } from './components/portal-footer/portal-footer.component'
import { RouterModule } from '@angular/router'
import {AngularRemoteComponentsModule} from '@onecx/angular-remote-components'

@NgModule({
  imports: [CommonModule, RouterModule, AngularRemoteComponentsModule],
  declarations: [PortalViewportComponent, HeaderComponent, PortalFooterComponent],
  exports: [PortalViewportComponent, HeaderComponent, PortalFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShellCoreModule {}
