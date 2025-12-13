import { isValidElement, cloneElement } from 'react';
import * as ReactDOM from 'react-dom';

import { getOnecxTriggerElement } from './functions/onecx-trigger-element';
import { getStyleDataOrIntermediateStyleData } from './functions/getStyleDataOrIntermediateStyleData';
import { appendIntermediateStyleData } from './functions/appendIntermediateStyleData';

const originalCreatePortal = ReactDOM.createPortal;
(function ensurePrimereactDynamicDataIncludesIntermediateStyleData() {
  (ReactDOM as any).createPortal = function (
    children: any,
    container: any,
    ...rest: any
  ) {
    let patchedChildren = children.props.children;
    const onecxTrigger = getOnecxTriggerElement();
    if (
      onecxTrigger &&
      (patchedChildren.props.className as string).includes('p-') // PrimeReact classes start with 'p-'
    ) {
      const styleData = onecxTrigger
        ? getStyleDataOrIntermediateStyleData(onecxTrigger)
        : null;

      if (isValidElement(patchedChildren)) {
        const intermediateStyleData = styleData
          ? appendIntermediateStyleData(styleData)
          : {};
        // Append intermediate data so the isolation does not happen by coincidence
        patchedChildren = cloneElement(patchedChildren, {
          ...(children as any).props,
          ...intermediateStyleData,
        });
      }
    }
    return originalCreatePortal(
      { ...children, props: { ...children.props, children: patchedChildren } },
      container,
      ...rest,
    );
  };
})();
