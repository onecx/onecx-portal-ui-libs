import type { CssRule } from '../../mapper.types';

const OVERLAY_COMPONENT: CssRule = {
  selector: 'ocx-loading-indicator .full-overlay .overlay',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.loadingIndicator.overlay.background',
    },
  ],
};

const OVERLAY_DIRECTIVE: CssRule = {
  selector: '.element-overlay::before',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.loadingIndicator.overlay.background',
    },
  ],
};

const SPINNER: CssRule = {
  selector: '.full-overlay .loader,.element-overlay .loader',
  declarations: [
    {
      property: 'border-top-color',
      from: 'usages.loadingIndicator.overlay.spinner.border.color',
    },
    {
      property: 'border-right-color',
      from: 'usages.loadingIndicator.overlay.spinner.border.color',
    },
    {
      property: 'border-left-color',
      from: 'usages.loadingIndicator.overlay.spinner.border.color',
    },
    {
      property: 'border-bottom-color',
      value: 'transparent',
    },
    {
      property: 'width',
      from: 'usages.loadingIndicator.overlay.spinner.size',
    },
    {
      property: 'height',
      from: 'usages.loadingIndicator.overlay.spinner.size',
    },
    {
      property: 'border-width',
      from: 'usages.loadingIndicator.overlay.spinner.border.width',
    },
    {
      property: 'animation-duration',
      from: 'usages.loadingIndicator.overlay.spinner.animationDuration',
    },
  ],
};

export const loadingIndicatorCssRules: CssRule[] = [
  OVERLAY_COMPONENT,
  OVERLAY_DIRECTIVE,
  SPINNER,
];
