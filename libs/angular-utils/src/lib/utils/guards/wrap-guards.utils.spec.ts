// import { Route } from '@angular/router';
// import { wrapGuards } from './wrap-guards.utils';
// import { GuardWrapper } from './guard-wrapper';

// describe('wrapGuards', () => {
//   it('should wrap a list of regular activate guards', () => {
//     const route: Route = {
//       path: 'test',
//       canActivate: [jest.fn(), jest.fn()],
//     };
//     const guardWrapper = new GuardWrapper();

//     wrapGuards(route, guardWrapper);

//     expect(route.canActivate).toHaveLength(1);
//     expect(route.canActivate?.[0]).toBeInstanceOf(GuardWrapper);
//   });

//   it('should not change activate guards if already wrapped and only wrapper exists', () => {
//     const existingWrapper = new GuardWrapper();
//     jest.spyOn(existingWrapper, 'setActivateGuards');
//     const route: Route = {
//       path: 'test',
//       canActivate: [existingWrapper],
//     };

//     wrapGuards(route, existingWrapper);

//     expect(route.canActivate).toHaveLength(1);
//     expect(route.canActivate?.[0]).toBe(existingWrapper);
//     expect(existingWrapper.setActivateGuards).not.toHaveBeenCalled();
//   });

//   it('should add new activate guards to the existing wrapper', () => {
//     const existingWrapper = new GuardWrapper();
//     jest.spyOn(existingWrapper, 'setActivateGuards');
//     const newGuard = jest.fn();
//     const route: Route = {
//       path: 'test',
//       canActivate: [existingWrapper, newGuard],
//     };

//     wrapGuards(route, existingWrapper);

//     expect(route.canActivate).toHaveLength(1);
//     expect(route.canActivate?.[0]).toBe(existingWrapper);
//     expect(existingWrapper.setActivateGuards).toHaveBeenCalledWith(route, expect.arrayContaining([newGuard]));
//   });

//   it('should wrap a list of regular deactivate guards', () => {
//     const route: Route = {
//       path: 'test',
//       canDeactivate: [jest.fn(), jest.fn()],
//     };
//     const guardWrapper = new GuardWrapper();

//     wrapGuards(route, guardWrapper);

//     expect(route.canDeactivate).toHaveLength(1);
//     expect(route.canDeactivate?.[0]).toBeInstanceOf(GuardWrapper);
//   });

//   it('should not change deactivate guards if already wrapped and only wrapper exists', () => {
//     const existingWrapper = new GuardWrapper();
//     jest.spyOn(existingWrapper, 'setDeactivateGuards');
//     const route: Route = {
//       path: 'test',
//       canDeactivate: [existingWrapper],
//     };

//     wrapGuards(route, existingWrapper);

//     expect(route.canDeactivate).toHaveLength(1);
//     expect(route.canDeactivate?.[0]).toBe(existingWrapper);
//     expect(existingWrapper.setDeactivateGuards).not.toHaveBeenCalled();
//   });

//   it('should add new deactivate guards to the existing wrapper', () => {
//     const existingWrapper = new GuardWrapper();
//     jest.spyOn(existingWrapper, 'setDeactivateGuards');
//     const newGuard = jest.fn();
//     const route: Route = {
//       path: 'test',
//       canDeactivate: [existingWrapper, newGuard],
//     };

//     wrapGuards(route, existingWrapper);

//     expect(route.canDeactivate).toHaveLength(1);
//     expect(route.canDeactivate?.[0]).toBe(existingWrapper);
//     expect(existingWrapper.setDeactivateGuards).toHaveBeenCalledWith(route, expect.arrayContaining([newGuard]));
//   });
// });
