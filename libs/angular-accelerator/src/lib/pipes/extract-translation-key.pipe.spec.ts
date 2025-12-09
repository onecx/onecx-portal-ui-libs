import { ExtractTranslationKeyPipe } from './extract-translation-key.pipe';

describe('ExtractTranslationKeyPipe', () => {
  const pipe = new ExtractTranslationKeyPipe();

  it('should extract key from object', () => {
    expect(pipe.transform({ key: 'LABEL_KEY', parameters: { status: 'testStatus' } }, 'key')).toBe('LABEL_KEY');
    expect(pipe.transform('LABEL_KEY_STRING', 'key')).toBe('LABEL_KEY_STRING');
    expect(pipe.transform({ parameters: { status: 'testStatus' } } as any, 'key', 'fallback')).toBe('fallback');
    expect(pipe.transform(null, 'key', 'fallback')).toBe('fallback');
    expect(pipe.transform(undefined, 'key', 'fallback')).toBe('fallback');
  });

  it('should handle params mode correctly', () => {
    expect(pipe.transform('LABEL_KEY_STRING', 'params')).toBeUndefined();
    expect(pipe.transform({ key: 'LABEL_KEY', parameters: { foo: 'bar' } }, 'params')).toEqual({ foo: 'bar' });
    expect(pipe.transform({ key: 'LABEL_KEY' }, 'params')).toBeUndefined();
    expect(pipe.transform(null, 'params')).toBeUndefined();
    expect(pipe.transform(undefined, 'params')).toBeUndefined();
  });

  it('should return fallback for unknown mode', () => {
    expect(pipe.transform('LABEL_KEY_STRING', 'unknown' as any, 'myFallback')).toBe('myFallback');
    expect(pipe.transform('LABEL_KEY_STRING', 'unknown' as any)).toBe('');
  });
});
