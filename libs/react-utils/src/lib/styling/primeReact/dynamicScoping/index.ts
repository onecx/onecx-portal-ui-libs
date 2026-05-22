import { isValidElement, cloneElement, type ReactElement } from 'react'
import * as ReactDOM from 'react-dom'

import { getOnecxTriggerElement } from './functions/onecx-trigger-element'
import { getStyleDataOrIntermediateStyleData } from './functions/getStyleDataOrIntermediateStyleData'
import { appendIntermediateStyleData } from './functions/appendIntermediateStyleData'

const originalCreatePortal = ReactDOM.createPortal
;(function ensurePrimereactDynamicDataIncludesIntermediateStyleData() {
  ;(ReactDOM as any).createPortal = function (children: any, container: any, ...rest: any) {
    if (!isValidElement(children)) {
      return originalCreatePortal(children, container, ...rest)
    }
    const childElement = children as ReactElement<any>
    let patchedChildren = childElement.props.children
    if (!isValidElement(patchedChildren)) {
      return originalCreatePortal(children, container, ...rest)
    }
    const patchedChildElement = patchedChildren as ReactElement<any>
    const onecxTrigger = getOnecxTriggerElement()
    if (
      onecxTrigger &&
      (patchedChildElement.props.className as string).includes('p-') // PrimeReact classes start with 'p-'
    ) {
      const styleData = onecxTrigger ? getStyleDataOrIntermediateStyleData(onecxTrigger) : null
      const intermediateStyleData = styleData ? appendIntermediateStyleData(styleData) : {}
      // Append intermediate data so the isolation does not happen by coincidence
      patchedChildren = cloneElement(patchedChildElement, {
        ...patchedChildElement.props,
        ...intermediateStyleData,
      })
    }
    return originalCreatePortal(
      {
        ...childElement,
        props: { ...childElement.props, children: patchedChildren },
      },
      container,
      ...rest
    )
  }
})()
