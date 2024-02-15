/**
 * @param {MouseEvent}  event
 * @param {HTMLDialogElement} dialog
 * @returns {boolean}
 */
export default function isEventInsideElement(event, dialog) {
  const { clientX, clientY} = event;
  const target = /** @type {Node} */ (event.target);
  const { x, y, width, height } = dialog.getBoundingClientRect();

  // If the target IS the dialog, check that the event is inside the bounds. A
  // click on the backdrop of a dialog will appear as a click on the dialog
  // itself, but will be outside the bounds.
  if (dialog === target) {
    return (
      clientX >= x &&
      clientX <= x + width &&
      clientY >= y &&
      clientY <= y + height
    );
  }

  // If the target isn't the dialog itself, check that it's inside the dialog
  return dialog.contains(target);
}