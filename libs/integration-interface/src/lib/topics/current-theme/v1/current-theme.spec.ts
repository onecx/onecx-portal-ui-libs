/**
 * @jest-environment jsdom
 */

import { ensureProperty } from '@onecx/accelerator';
import { CurrentThemeTopic } from './current-theme.topic';
import { Theme } from './theme.model'

const origAddEventListener = window.addEventListener
const origPostMessage = window.postMessage

let listeners: any[] = []
window.addEventListener = (_type: any, listener: any) => {
  listeners.push(listener)
}

window.removeEventListener = (_type: any, listener: any) => {
  listeners = listeners.filter((l) => l !== listener)
}

window.postMessage = (m: any) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
}

describe('CurrentThemeTopic', () => {
  beforeEach(() => {
    listeners = []
    // Seed the accelerator namespace expected at import time
    const gathererPromises = ensureProperty(globalThis, ['@onecx/accelerator', 'gatherer', 'promises'], {});
    const gathererDebug = ensureProperty(gathererPromises, ['@onecx/accelerator', 'gatherer', 'debug'], []);
    const accelerator = ensureProperty(gathererDebug, ['@onecx/accelerator', 'topic','initDate'], Date.now() - 1000000);
    accelerator['@onecx/accelerator'].topic.initDate = Date.now() - 1000000;
  });

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
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
