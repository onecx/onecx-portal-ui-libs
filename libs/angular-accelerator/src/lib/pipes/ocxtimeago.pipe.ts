import { Pipe, PipeTransform } from '@angular/core'
import { TimeagoPipe } from 'ngx-timeago'

@Pipe({
  name: 'timeago',
})
export class OcxTimeAgoPipe implements PipeTransform extends TimeagoPipe {}
