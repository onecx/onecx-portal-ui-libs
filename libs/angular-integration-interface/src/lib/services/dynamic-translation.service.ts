import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DynamicTranslationService as DynamicTranslationInterface,
  TranslationContext,
} from '@onecx/integration-interface';

@Injectable({ providedIn: 'root' })
export class DynamicTranslationService implements OnDestroy {
  private readonly dynamicTranslationInterface = new DynamicTranslationInterface();

  getTranslations(
    lang: string,
    contexts: TranslationContext[]
  ): Observable<Record<string, Record<string, unknown>>> {
    return this.dynamicTranslationInterface.getTranslations(lang, contexts);
  }

  ngOnDestroy(): void {
    this.dynamicTranslationInterface.destroy();
  }
}
