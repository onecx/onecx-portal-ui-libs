import { NgModule } from '@angular/core';
import { provideStandaloneProviders } from './utils/expose-standalone.utils';
import { StandaloneShellViewportComponent } from './components/standalone-shell-viewport/standalone-shell-viewport.component';
import { ShellCoreModule } from '@onecx/shell-core'
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [StandaloneShellViewportComponent],
    imports: [CommonModule, ShellCoreModule, RouterModule],
    exports: [StandaloneShellViewportComponent],
    providers: [provideStandaloneProviders()],
})
export class StandaloneShellModule { }
