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
      property: 'border-color',
      from: 'usages.loadingIndicator.spinner.color',
    },
    {
      property: 'border-bottom-color',
      from: 'usages.loadingIndicator.spinner.trackColor',
    },
    {
      property: 'width',
      from: 'usages.loadingIndicator.spinner.size',
    },
    {
      property: 'height',
      from: 'usages.loadingIndicator.spinner.size',
    },
    {
      property: 'border-width',
      from: 'usages.loadingIndicator.spinner.border.width',
    },
    {
      property: 'animation-duration',
      from: 'usages.loadingIndicator.spinner.animationDuration',
    },
  ],
};

export const loadingIndicatorCssRules: CssRule[] = [
  OVERLAY_COMPONENT,
  OVERLAY_DIRECTIVE,
  SPINNER,
];
