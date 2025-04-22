import { NgModule } from '@angular/core'
import { StandaloneShellViewportComponent } from './components/standalone-shell-viewport/standalone-shell-viewport.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@NgModule({
  declarations: [StandaloneShellViewportComponent],
  imports: [CommonModule, RouterModule],
  exports: [StandaloneShellViewportComponent],
  providers: [],
})
export class StandaloneShellModule {}
