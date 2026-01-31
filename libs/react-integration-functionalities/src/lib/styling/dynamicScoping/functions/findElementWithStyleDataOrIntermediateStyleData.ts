import {
  dataIntermediateStyleIdKey,
  dataStyleIdKey,
} from '../../../utils/styleAttributes';

/**
 * Finds the closest parent element with style data or intermediate style data.
 * @param startNode Starting node to search from
 * @returns The closest parent element with style data or intermediate style data, or null if not found.
 */
export function findElementWithStyleDataOrIntermediateStyleData(
  startNode: Node | EventTarget
): HTMLElement | null {
  let currentNode = startNode;
  const hasStyleData = (node: HTMLElement) =>
    node.dataset[dataStyleIdKey] || node.dataset[dataIntermediateStyleIdKey];
  while (
    currentNode instanceof HTMLElement &&
    !hasStyleData(currentNode) &&
    currentNode.parentElement
  ) {
    currentNode = currentNode.parentElement;
  }
  return currentNode instanceof HTMLElement && hasStyleData(currentNode)
    ? currentNode
    : null;
}
