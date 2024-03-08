import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { SearchConfigInfo } from '../../../model/search-config-info'

@Component({
  selector: 'ocx-search-config',
  templateUrl: './search-config.component.html',
  styleUrls: ['./search-config.component.scss'],
})
export class SearchConfigComponent implements OnInit {
  @Input()
  searchConfigs: SearchConfigInfo[] | [] | undefined

  @Input() placeholderKey = 'OCX_SEARCH_HEADER.OCX_SEARCH_CONFIG.DROPDOWN_DEFAULT'

  @Output()
  selectedSearchConfigChanged: EventEmitter<SearchConfigInfo> = new EventEmitter()

  formGroup: FormGroup | undefined
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      searchConfigForm: new FormControl<SearchConfigInfo | null>(null),
    })
  }

  onSearchConfigChange(searchConfig: SearchConfigInfo) {
    this.selectedSearchConfigChanged?.emit(searchConfig)
  }
}
