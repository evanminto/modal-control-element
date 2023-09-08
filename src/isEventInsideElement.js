/**
 * @param {MouseEvent}  event
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default function isEventInsideElement(event, element) {
  const { target, offsetX, offsetY } = event;

  return (
    offsetX >= 0 && offsetX <= element.offsetWidth &&
    offsetY >= 0 && offsetY <= element.offsetHeight
  );
}