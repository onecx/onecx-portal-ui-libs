import { Subject, of, firstValueFrom } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { createFragmentParamsEffect } from './create-fragment-params-effect';

describe('createFragmentParamsEffect', () => {
    const router = { navigate: jest.fn() } as any;
    const actionsSubject = new Subject<any>();
    const actions$ = new Actions(actionsSubject.asObservable());
    const actionType = 'TEST';

    beforeEach(() => jest.clearAllMocks());

    it('no navigation when fragment is null', async () => {
        const activatedRoute = { fragment: of(undefined) } as any;
        const reducer = jest.fn();

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('navigates with params returned by reducer when fragment is present', async () => {
        const activatedRoute = { fragment: of('hash?param=1&test=key') } as any;
        const reducer = jest.fn().mockImplementation((_state, _action) => ({ new: 'value', test: ['key'], another: null }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: expect.stringContaining('hash?new=value&test=key'),
            replaceUrl: true,
            onSameUrlNavigation: 'reload',
            relativeTo: activatedRoute
        }));
    });
});
