/**
 * @param {MouseEvent}  event
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default function isEventInsideElement(event, element) {
  const { clientX, clientY} = event;
  const target = /** @type {HTMLElement} */ (event.target);
  const { x, y, width, height } = element.getBoundingClientRect();

  return (
    // Is target nested inside element?
    element.contains(target) ||
    // If not, was the click inside the bounding box? (Note: Clicks triggered
    // via keyboard focus/spacebar will have clientX and clientY set to 0)
    (
      clientX >= x &&
      clientX <= x + width &&
      clientY >= y &&
      clientY <= y + height
    )
  );
}