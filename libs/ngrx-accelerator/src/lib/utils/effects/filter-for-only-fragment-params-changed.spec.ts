import { RoutesRecognized } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { filterOutOnlyFragmentParamsChanged } from './filter-for-only-fragment-params-changed';

const MOCK_ROUTER_NAVIGATED = 'MOCK_ROUTER_NAVIGATED';

describe('filterOutOnlyFragmentParamsChanged', () => {
    it("should not filter when Fragment params changed", async () => {
        const router: any = {
            events: of(new RoutesRecognized(0, '/', '/', {} as any)),
            routerState: { snapshot: { url: 'http://abc/#page?param1=1' } },
        };
        const action: any = {
            type: MOCK_ROUTER_NAVIGATED,
            payload: { event: { urlAfterRedirects: 'http://cde/#page?param1=2' } },
        };
        const results = await firstValueFrom(of(action).pipe(filterOutOnlyFragmentParamsChanged(router)));

        expect(results).toEqual(action);
    });
});
