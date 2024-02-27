import { Injectable, Type } from "@angular/core";
import { SlotService } from "@onecx/shell-core";
import { Observable, of } from "rxjs";
import { StandaloneMenuComponent } from "../components/standalone-menu/standalone-menu.component";

@Injectable()
export class StandaloneSlotService implements SlotService {
    private slotConfig: Record<string, Type<unknown>[]> = {
        "menu": [StandaloneMenuComponent]
    };

    async init(): Promise<void> {
        return Promise.resolve()
    }

    getComponentsForSlot(slotName: string): Observable<Type<unknown>[]> {
        return of(this.slotConfig[slotName] ?? [])
    }
}