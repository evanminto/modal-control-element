import ModalControlElement from './ModalControlElement.js';

/**
 * @param {string} name
 * @returns {void}
 */
const define = (name = 'modal-control') => {
  if ('customElements' in window) {
    customElements.define(name, ModalControlElement);
  }
};

export { ModalControlElement, define };
