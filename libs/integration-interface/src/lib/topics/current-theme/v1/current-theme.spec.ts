/**
 * @jest-environment jsdom
 */

import { ensureProperty } from '@onecx/accelerator';
import { CurrentThemeTopic } from './current-theme.topic';
import { Theme } from './theme.model'

describe('CurrentThemeTopic', () => {
  beforeEach(() => {
    // Seed the accelerator namespace expected at import time
    ensureProperty(globalThis as object, ['@onecx/accelerator', 'gatherer', 'promises'], {} as Record<number, Array<Promise<any>>>)
    ensureProperty(globalThis as object, ['@onecx/accelerator', 'gatherer', 'debug'], [] as string[]);
    ensureProperty(globalThis as object, ['@onecx/accelerator', 'topic', 'initDate'], Date.now() - 1000000)
  });

  it('publishes to subscribers', async () => {
    const topic = new CurrentThemeTopic();

    const firstValue = new Promise<Theme>((resolve) => {
      topic.subscribe((v: Theme) => resolve(v));
    });

    const theme: Theme = {
      id: 'test',
      properties: { general: { 'primary-color': '#ff00ff' } },
      overrides: [],
    };

    // Publish; value will resolve once internal init completes and queues flush
    topic.publish(theme);

    const received = await firstValue;
    expect(received).toEqual(theme);

    topic.destroy?.();
  });
});
