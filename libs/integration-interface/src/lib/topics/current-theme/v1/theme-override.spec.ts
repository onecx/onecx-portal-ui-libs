/**
 * @jest-environment node
 */

import { OverrideType, ThemeOverride } from './theme-override.model';

describe('Theme overrides typing & behavior', () => {
  const theme = {
    name: 'default',
    properties: '',
    displayName: 'OneCX',
    overrides: [
      {
        type: 'PRIMENG',
        value:
          '{"semantic":{ "primary": {"500": "#3b82f6"},"extend":{"onecx":{"topbar": {"bg":{"color":"#3b82f6"}}}}}}',
      },
      {
        type: 'CSS',
        value: '.my-dash-class{bg-color: "#ffffff"}',
      },
    ],
  };

  it('should classify overrides as PRIMENG or CSS using the enum', () => {
    // Treat incoming data as ThemeOverride[] at runtime
    const overrides = theme.overrides as ThemeOverride[];

    // First override is PRIMENG (JSON string to parse)
    expect(overrides[0].type).toBe(OverrideType.PRIMENG);
    expect(typeof overrides[0].value).toBe('string');

    // Second override is CSS (raw string)
    expect(overrides[1].type).toBe(OverrideType.CSS);
    expect(typeof overrides[1].value).toBe('string');
    expect(overrides[1].value).toContain('.my-dash-class');
  });

  it('should be resilient to optional fields being absent', () => {
    const empty: ThemeOverride = {};
    expect(empty.type).toBeUndefined();
    expect(empty.value).toBeUndefined();
  });
});
