import { Component, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { MfeInfo } from '../../../model/mfe-info.model'
import { AppStateService } from '@onecx/angular-integration-interface'

@Component({
  standalone: false,
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
export class MfeDebugComponent {
  private appStateService = inject(AppStateService);

  isMFE$: Observable<boolean>
  mfeInfo$: Observable<MfeInfo>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.isMFE$ = this.appStateService.currentMfe$.pipe(map((mfe) => !!mfe))
    this.mfeInfo$ = this.appStateService.currentMfe$.asObservable()
  }
}
