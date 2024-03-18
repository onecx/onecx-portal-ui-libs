import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'ocx-shell-footer',
  templateUrl: './portal-footer.component.html',
  styleUrls: ['./portal-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalFooterComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
