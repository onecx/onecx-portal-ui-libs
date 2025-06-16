import { NgModule } from '@angular/core'
import { provideStandaloneProviders } from './utils/expose-standalone.utils'
import { StandaloneShellViewportComponent } from './components/standalone-shell-viewport/standalone-shell-viewport.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [StandaloneShellViewportComponent],
  imports: [CommonModule, RouterModule, ToastModule, TranslateModule],
  exports: [StandaloneShellViewportComponent, ToastModule, TranslateModule],
  providers: [provideStandaloneProviders()],
})
export class StandaloneShellModule {}
