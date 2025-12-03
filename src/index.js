import ModalControlElement from './ModalControlElement.js';
import ModalController from './ModalController.js';

/**
 * @param {string} [name]
 * @returns {void}
 */
const define = (name = 'modal-control') => {
  if ('customElements' in window) {
    customElements.define(name, ModalControlElement);
  }
};

export { ModalControlElement, ModalController, define };
