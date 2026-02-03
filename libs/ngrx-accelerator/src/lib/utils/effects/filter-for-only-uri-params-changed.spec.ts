import { RoutesRecognized } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { filterOutOnlyUriParamsChanged } from './filter-for-only-uri-params-changed';

const MOCK_ROUTER_NAVIGATED = 'MOCK_ROUTER_NAVIGATED';

describe('filterOutOnlyUriParamsChanged', () => {
    it("should filter when uri params changed", async () => {
        const router: any = {
            events: of(new RoutesRecognized(0, '/', '/', {} as any)),
            routerState: { snapshot: { url: 'http://abc/#page?param1=1' } },
        };
        const action: any = {
            type: MOCK_ROUTER_NAVIGATED,
            payload: { event: { urlAfterRedirects: 'http://cde/#page?param1=2' } },
        };
        const results = await firstValueFrom(of(action).pipe(filterOutOnlyUriParamsChanged(router)));

        expect(results).toEqual(action);
    });
});