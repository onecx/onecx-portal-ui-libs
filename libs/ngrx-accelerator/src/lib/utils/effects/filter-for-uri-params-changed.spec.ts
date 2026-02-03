import { firstValueFrom, of } from 'rxjs';
import { RoutesRecognized } from '@angular/router';
import { z } from 'zod';
import { filterOutUriParamsHaveNotChanged } from './filter-for-uri-params-changed';

const MOCK_ROUTER_NAVIGATED = 'MOCK_ROUTER_NAVIGATED';
const MOCK_ROUTE: any = {
    events: of(new RoutesRecognized(0, '/', '/', {} as any)),
    routerState: { snapshot: { root: { fragment: 'page?param1=1' } } },
};

const MOCK_ROUTE2: any = {
    events: of(new RoutesRecognized(0, '/', '/', {} as any)),
    routerState: { snapshot: { root: { fragment: 'page?param1=2' } } },
};

const MOCK_ACTION: any = {
    type: MOCK_ROUTER_NAVIGATED,
    payload: { routerState: { root: { fragment: 'page?param1=2' } } },
};

const MOCK_EMPTY_ACTION: any = {
    type: MOCK_ROUTER_NAVIGATED,
    payload: { routerState: { root: { fragment: '' } } },
};

const MOCK_EMPTY_ROUTE: any = {
    events: of(new RoutesRecognized(0, '/', '/', {} as any)),
    routerState: { snapshot: { root: { fragment: '' } } },
};

describe('filterOutUriParamsHaveNotChanged', () => {
    const schema = z.object({ param1: z.string().optional() });
    const router = MOCK_ROUTE;
    const action = MOCK_ACTION;

    it('filter when params changed', async () => {
        const results = await firstValueFrom(of(action).pipe(filterOutUriParamsHaveNotChanged(router, schema)));

        expect(results).toEqual(action);
    });

    it('should not filter when params unchanged', async () => {
        const action = MOCK_ACTION;
        const router = MOCK_ROUTE2;
        const emitted: any[] = [];

        await of(action)
            .pipe(filterOutUriParamsHaveNotChanged(router, schema))
            .forEach((a) => emitted.push(a));

        expect(emitted).toHaveLength(0);
    });

    it('filter when both empty and allowEmptyUriParamsList is true', async () => {
        const router = MOCK_EMPTY_ROUTE;
        const schema = z.object({});
        const action = MOCK_EMPTY_ACTION;
        const emitted: any[] = [];

        await of(action)
            .pipe(filterOutUriParamsHaveNotChanged(router, schema, true))
            .forEach((a) => emitted.push(a));

        expect(emitted).toHaveLength(1);
    });

    it('should not filter when both empty and allowEmptyUriParamsList is false', async () => {
        const router = MOCK_EMPTY_ROUTE;
        const schema = z.object({});
        const action = MOCK_EMPTY_ACTION;
        const emitted: any[] = [];

        await of(action)
            .pipe(filterOutUriParamsHaveNotChanged(router, schema, false))
            .forEach((a) => emitted.push(a));

        expect(emitted).toHaveLength(0);
    });

    it('should not filter when validation fails', async () => {
        const schema = z.object({ param: z.number() });
        const emitted: any[] = [];

        await of(action)
            .pipe(filterOutUriParamsHaveNotChanged(router, schema))
            .forEach((a) => emitted.push(a));

        expect(emitted).toHaveLength(0);
    });

    it('should not filter when empty params', async () => {
        const schema = z.object({ param: z.number() });
        const emitted: any[] = [];
        const action: any = {
            type: MOCK_ROUTER_NAVIGATED,
            payload: { routerState: { root: { fragment: 'page?' } } },
        };
        await of(action)
            .pipe(filterOutUriParamsHaveNotChanged(router, schema))
            .forEach((a) => emitted.push(a));

        expect(emitted).toHaveLength(0);
    });
});