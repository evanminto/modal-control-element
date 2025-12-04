import { deepContains } from "./deepContains.js";
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
        const root = dialog.getRootNode();
        
        /** @param {Event} event */
        const handleClickDirectRoot = (event) => {
          // If the click is inside the dialog, ignore it
          if (!(event instanceof MouseEvent) || isEventInsideElement(event, dialog)) {
            return;
          }

          this.hide();
        };

        if (root instanceof ShadowRoot) {
          root.addEventListener(
            'click',
            handleClickDirectRoot,
            { signal: abortController.signal }
          );

          dialog.getRootNode({ composed: true }).addEventListener(
            'click',
            (event) => {
              // If the target is an ancestor of the dialog, ignore the click
              // (the shadow click handler should take care of anything inside
              // the target that's not the dialog)
              if (!(event.target instanceof Node) || deepContains(event.target, dialog)) {
                return;
              }

              this.hide();
            },
            { signal: abortController.signal }
          );
        } else {
          root.addEventListener(
            'click',
            handleClickDirectRoot,
            { signal: abortController.signal }
          );
        }

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
