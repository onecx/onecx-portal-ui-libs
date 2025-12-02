import { StyleData } from '../types';

/**
 * Appends intermediate style data to an element.
 * @param element HTMLElement to append style data to.
 * @param styleData StyleData object containing style information.
 */
export function appendIntermediateStyleData(
  styleData: StyleData
): Record<string, string> {
  const props: Record<string, string> = {};

  if (styleData.dataIntermediateStyleIdKey) {
    props['data-intermediate-style-id'] = styleData.dataIntermediateStyleIdKey;
  }

  if (
    styleData.dataIntermediateNoPortalLayoutStylesKey ||
    styleData.dataIntermediateNoPortalLayoutStylesKey === ''
  ) {
    props['data-intermediate-no-portal-layout-styles'] =
      styleData.dataIntermediateNoPortalLayoutStylesKey;
  }

  if (
    styleData.dataIntermediateMfeElementKey ||
    styleData.dataIntermediateMfeElementKey === ''
  ) {
    props['data-intermediate-mfe-element'] =
      styleData.dataIntermediateMfeElementKey;
  }

  return props;
}
