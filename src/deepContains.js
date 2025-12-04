/**
 * Checks if an ancestor node contains a descendant node, crossing shadow
 * boundaries
 * @param {Node} ancestor
 * @param {Node} descendant
 */
export function deepContains(ancestor, descendant) {
  // First, check via normal contains (fastest, but doesn't work with shadow
  // roots)
  if (ancestor.contains(descendant)) {
    return true;
  }

  // This could be a shadow root or a document
  const root = descendant.getRootNode();

  if (root instanceof ShadowRoot) {
    // Check the host of the shadow root
    return deepContains(ancestor, root.host);
  }

  // If it's not a shadow root and contains() returned false, it's definitely
  // not a match
  return false;
}
