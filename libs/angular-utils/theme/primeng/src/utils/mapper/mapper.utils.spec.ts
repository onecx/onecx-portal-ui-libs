import { getByPath, setByPath } from './mapper.utils';

describe('setByPath', () => {
  it('writes a value to a deep dot path, creating intermediate objects', () => {
    const obj: Record<string, unknown> = {};
    setByPath(obj, 'a.b.c', 42);
    expect(getByPath(obj, 'a.b.c')).toBe(42);
  });

  it('overwrites an existing value without disturbing siblings', () => {
    const obj: Record<string, unknown> = { a: { keep: 1, c: 'old' } };
    setByPath(obj, 'a.c', 'new');
    expect(getByPath(obj, 'a.keep')).toBe(1);
    expect(getByPath(obj, 'a.c')).toBe('new');
  });
});

// Regression guard for the CodeQL "prototype-polluting function" finding on `setByPath`:
// a dot path containing `__proto__` must not be able to mutate the shared Object prototype.
describe('setByPath prototype-pollution guard', () => {
  it('does not mutate Object.prototype when a path segment is __proto__', () => {
    const obj: Record<string, unknown> = {};
    setByPath(obj, '__proto__.polluted', 'oops');
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('does not write through a __proto__ segment mid-path', () => {
    const obj: Record<string, unknown> = {};
    setByPath(obj, 'a.__proto__.polluted', 'oops');
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    // The neutralized path must not have created a nested "a" object either.
    expect(obj.a).toBeUndefined();
  });

  it('leaves the target object untouched for a __proto__ path', () => {
    const obj: Record<string, unknown> = { existing: 1 };
    setByPath(obj, '__proto__.polluted', 'oops');
    expect(obj).toEqual({ existing: 1 });
  });

  it('still handles a normal path that merely contains the word proto (not __proto__)', () => {
    const obj: Record<string, unknown> = {};
    setByPath(obj, 'prototype', 'value');
    expect(getByPath(obj, 'prototype')).toBe('value');
  });
});
