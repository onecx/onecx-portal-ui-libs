import { Pipe } from '@angular/core'
import { TimeagoPipe } from 'ngx-timeago'

@Pipe({
  name: 'timeago',
})
export class OcxTimeAgoPipe extends TimeagoPipe {}
