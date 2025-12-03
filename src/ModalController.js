import isEventInsideElement from "./isEventInsideElement.js";

/**
 * @typedef {{
 *   lightDismiss?: boolean;
 *   canToggle?: () => boolean;
 *   onToggle?: () => void;
 * }} ModalOptions
 */

export default class ModalController {
  #dialogOrGetter;
  #options;
  
  /**
   * @param {HTMLDialogElement | (() => HTMLDialogElement?)} dialog Element or getter
   * @param {ModalOptions} [options]
   */
  constructor(dialog, options) {
    const defaultOptions = { canToggle: () => true };
    this.#dialogOrGetter = dialog;
    this.#options = Object.assign(defaultOptions, options);
  }

  show() {
    const dialog = this.#getDialog();

    if (!dialog || dialog.matches(':modal') || !this.#options.canToggle?.()) {
      return;
    }
    
    const abortController = new AbortController();
    dialog.showModal();

    if (this.#options.lightDismiss) {
      dialog.addEventListener(
        'click',
        (event) => {
          if (!(event instanceof MouseEvent) || isEventInsideElement(event, dialog)) {
            return;
          }

          this.hide();
        },
        { signal: abortController.signal }
      );

      setTimeout(() => {
        dialog.getRootNode({ composed: true }).addEventListener(
          'click',
          (event) => {
            if (!(event.target instanceof Node) || dialog.contains(event.target)) {
              return;
            }

            this.hide();
          },
          { signal: abortController.signal }
        );

        dialog.addEventListener(
          'close',
          () => abortController.abort(),
          { signal: abortController.signal }
        );
      }, 0);
    }

    this.#options.onToggle?.();
  }

  hide() {
    const dialog = this.#getDialog();

    if (!dialog || dialog.matches(':not(:modal)') || !this.#options.canToggle?.()) {
      return;
    }

    dialog.close();
    this.#options.onToggle?.();
  }

  toggle() {
    if (this.#getDialog()?.matches(':modal')) {
      this.hide();
    } else {
      this.show();
    }
  }

  #getDialog() {
    if (typeof this.#dialogOrGetter === 'function') {
      return this.#dialogOrGetter();
    }

    return this.#dialogOrGetter;
  }
}
