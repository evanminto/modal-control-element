import ModalController from "./ModalController.js";

/**
 * @customElement modal-control
 * @attr target - ID of the target `<dialog>`
 * @attr {'toggle'|'show'|'hide'} target-action - What should happen to the dialog when clicking the control (default: 'toggle')
 * @attr light-dismiss - If present, the modal will be closeable by clicking outside of it
 * @fires modal-control-before-toggle
 * @fires modal-control-toggle
 */
export default class ModalControlElement extends HTMLElement {
  /** @type {string | null} */
  #target = null;
  /** @type {'toggle' | 'show' | 'hide'} */
  #targetAction = 'toggle';
  /** @type {boolean} */
  #lightDismiss = false;
  /** @type {ModalController | undefined} */
  #controller;

  static observedAttributes = ['target', 'target-action', 'light-dismiss'];

  /**
   * @param {string}  name
   * @param {string | undefined}     _oldVal
   * @param {string | undefined}     newVal
   */
  attributeChangedCallback(name, _oldVal, newVal) {
    if (name === 'target') {
      this.#target = newVal || null;
    }

    if (
      name === 'target-action' &&
      newVal &&
      ['toggle', 'show', 'hide'].includes(newVal)
    ) {
      this.#targetAction = /** @type {'toggle' | 'show' | 'hide'} */ (newVal);
    }

    if (name === 'light-dismiss') {
      this.#lightDismiss = newVal !== undefined;
    }

    if (name === 'target' || name === 'light-dismiss') {
      this.#initController();
    }
  }

  /**
   * ID of the target `<dialog>`
   * @type {string|null}
   */
  get target() {
    return this.#target;
  }

  set target(value) {
    this.#target = value;

    if (value === null) {
      this.removeAttribute('target');
    } else {
      this.setAttribute('target', value);
    }
  }

  /**
   * What should happen to the dialog when clicking the control (default: 'toggle')
   * @type {'toggle'|'show'|'hide'}
   */
  get targetAction() {
    return this.#targetAction;
  }

  set targetAction(value) {
    if (!value) {
      return;
    }

    this.#targetAction = value;

    if (value === null) {
      this.removeAttribute('target-action');
    } else {
      this.setAttribute('target-action', value);
    }
  }

  /**
   * Determines how the user can close the target modal
   * @type {boolean}
   */
  get lightDismiss() {
    return this.#lightDismiss;
  }

  set lightDismiss(value) {
    this.#lightDismiss = Boolean(value);

    if (this.#lightDismiss) {
      this.setAttribute('light-dismiss', '');
    } else {
      this.removeAttribute('light-dismiss');
    }
  }

  /** @type {HTMLDialogElement|null} */
  get targetElement() {
    const root = /** @type {Document|ShadowRoot} */ (this.getRootNode());
    const el = this.target ? root.getElementById(this.target) : null;

    if (!(el instanceof HTMLDialogElement)) {
      return null;
    }

    return el;
  }

  connectedCallback() {
    this.addEventListener('click', this.#handleClick);
    this.#initController();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick);
  }

  #initController() {
    const root = this.getRootNode();

    if (root instanceof Document || root instanceof ShadowRoot) {
      this.#controller = new ModalController(() => this.targetElement, {
        lightDismiss: this.#lightDismiss,
        canToggle: () => this.#dispatchBeforeToggle(),
        onToggle: () => this.#dispatchToggle(),
      });
    }
  }

  /** @returns {boolean} */
  #dispatchBeforeToggle() {
    return this.dispatchEvent(
      new Event('modal-control-before-toggle', { cancelable: true })
    );
  }

  /** @returns {boolean} */
  #dispatchToggle() {
    return this.dispatchEvent(new Event('modal-control-toggle'));
  }

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  #handleClick = event => {
    const target = /** @type {Element} */ (event.target);

    if (!target.closest('button, input[type="button"]')) {
      return;
    }

    switch (this.targetAction) {
      case 'show':
        this.#controller?.show();
        break;
      case 'hide':
        this.#controller?.hide();
        break;
      case 'toggle':
        this.#controller?.toggle();
        break;
    }
  };
}
