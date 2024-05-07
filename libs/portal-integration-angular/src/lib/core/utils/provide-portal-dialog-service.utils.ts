import { DialogService } from 'primeng/dynamicdialog'
import { PortalDialogService } from '../../services/portal-dialog.service'

export function providePortalDialogService() {
  return [DialogService, PortalDialogService]
}
