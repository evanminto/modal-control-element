import isEventInsideElement from "./isEventInsideElement.js";

/**
 * @typedef {{
 *   lightDismiss?: boolean;
 *   canToggle?: () => boolean;
 *   onToggle?: () => void;
 * }} ModalOptions
 */

export default class ModalController {
  #dialog;
  #options;
  
  /**
   * @param {HTMLDialogElement} dialog
   * @param {ModalOptions} [options]
   */
  constructor(dialog, options) {
    const defaultOptions = { canToggle: () => true };

    this.#dialog = dialog;
    this.#options = Object.assign(defaultOptions, options);
  }

  show() {
    if (this.#dialog.matches(':modal') || !this.#options.canToggle?.()) {
      return;
    }
    
    const abortController = new AbortController();
    this.#dialog.showModal();

    if (this.#options.lightDismiss) {
      this.#dialog.addEventListener(
        'click',
        (event) => {
          if (!(event instanceof MouseEvent) || isEventInsideElement(event, this.#dialog)) {
            return;
          }

          this.hide();
        },
        { signal: abortController.signal }
      );

      setTimeout(() => {
        this.#dialog.getRootNode().addEventListener(
          'click',
          (event) => {
            if (!(event.target instanceof Node) || this.#dialog.contains(event.target)) {
              return;
            }

            this.hide();
          },
          { signal: abortController.signal }
        );

        this.#dialog.addEventListener(
          'close',
          () => abortController.abort(),
          { signal: abortController.signal }
        );
      }, 0);
    }

    this.#options.onToggle?.();
  }

  hide() {
    if (this.#dialog.matches(':not(:modal)') || !this.#options.canToggle?.()) {
      return;
    }

    this.#dialog.close();
    this.#options.onToggle?.();
  }

  toggle() {
    if (this.#dialog.matches(':modal')) {
      this.hide();
    } else {
      this.show();
    }
  }
}
