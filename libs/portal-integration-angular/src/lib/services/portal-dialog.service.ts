import { Injectable } from '@angular/core'
import { DialogService } from 'primeng/dynamicdialog'

/**
 * This is a bit of a hack. For some reason, providing MessageService does not work correctly across federated modules
 */
@Injectable({ providedIn: 'root' })
export class PortalDialogService extends DialogService {}
