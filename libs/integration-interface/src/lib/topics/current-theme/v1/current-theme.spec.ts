/**
 * @jest-environment jsdom
 */

import { CurrentThemeTopic, Theme } from '@onecx/integration-interface';

describe('CurrentThemeTopic', () => {
  beforeEach(() => {
    // Seed the accelerator namespace expected at import time
    (window as any)['@onecx/accelerator'] ??= {};
    (window as any)['@onecx/accelerator'].gatherer ??= {};
    (window as any)['@onecx/accelerator'].gatherer.promises ??= {};
    (window as any)['@onecx/accelerator'].gatherer.debug ??= [];
    (window as any)['@onecx/accelerator'].topic ??= {};
    (window as any)['@onecx/accelerator'].topic.initDate = Date.now() - 1000000;
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
