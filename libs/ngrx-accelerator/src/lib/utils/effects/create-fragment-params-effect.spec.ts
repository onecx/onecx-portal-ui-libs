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

    it('passes the params after the prefix to the reducer as a plain record', async () => {
        const activatedRoute = { fragment: of('search?param=1&test=key') } as any;
        const reducer = jest.fn().mockImplementation((state, _action) => ({ ...state, page: 2 }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).toHaveBeenCalledWith({ param: '1', test: 'key' }, { type: actionType });
        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: 'search?param=1&test=key&page=2',
        }));
    });

    it('omits null and undefined values from the fragment', async () => {
        const activatedRoute = { fragment: of('search?param=1') } as any;
        const reducer = jest.fn().mockImplementation(() => ({ name: 'x', a: null, b: undefined }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: 'search?name=x',
        }));
    });

    it('treats a fragment without "?" as prefix with no params', async () => {
        const activatedRoute = { fragment: of('search') } as any;
        const reducer = jest.fn().mockImplementation((state) => ({ ...state, page: 1 }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).toHaveBeenCalledWith({}, { type: actionType });
        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: 'search?page=1',
        }));
    });

    it('supports an empty prefix', async () => {
        const activatedRoute = { fragment: of('?a=1') } as any;
        const reducer = jest.fn().mockImplementation((state) => ({ ...state, b: '2' }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).toHaveBeenCalledWith({ a: '1' }, { type: actionType });
        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: '?a=1&b=2',
        }));
    });

    it('splits the fragment at the first "?" only', async () => {
        const activatedRoute = { fragment: of('search?q=a?b') } as any;
        const reducer = jest.fn().mockImplementation((state) => state);

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(reducer).toHaveBeenCalledWith({ q: 'a?b' }, { type: actionType });
        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: 'search?q=a%3Fb',
        }));
    });

    it('writes array values as repeated keys', async () => {
        const activatedRoute = { fragment: of('list?x=1') } as any;
        const reducer = jest.fn().mockImplementation(() => ({ ids: [1, 2] }));

        const effect$ = createFragmentParamsEffect(actions$, actionType as any, router, activatedRoute, reducer);
        const result = firstValueFrom(effect$);
        actionsSubject.next({ type: actionType });
        await result;

        expect(router.navigate).toHaveBeenCalledWith([], expect.objectContaining({
            fragment: 'list?ids=1&ids=2',
        }));
    });
});
