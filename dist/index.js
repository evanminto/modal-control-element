/**
 * @param {MouseEvent}  event
 * @param {HTMLDialogElement} dialog
 * @returns {boolean}
 */ function $a4743415ed687ae4$export$2e2bcd8739ae039(event, dialog) {
    const { clientX: clientX, clientY: clientY } = event;
    const target = /** @type {Node} */ event.target;
    const { x: x, y: y, width: width, height: height } = dialog.getBoundingClientRect();
    // If the target IS the dialog, check that the event is inside the bounds. A
    // click on the backdrop of a dialog will appear as a click on the dialog
    // itself, but will be outside the bounds.
    if (dialog === target) return clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height;
    // If the target isn't the dialog itself, check that it's inside the dialog
    return dialog.contains(target);
}


class $7d0ee5e0ea3ca1f6$export$2e2bcd8739ae039 {
    #dialog;
    #options;
    /**
   * @param {HTMLDialogElement} dialog
   * @param {ModalOptions} [options]
   */ constructor(dialog, options){
        const defaultOptions = {
            canToggle: ()=>true
        };
        this.#dialog = dialog;
        this.#options = Object.assign(defaultOptions, options);
    }
    show() {
        if (this.#dialog.matches(":modal") || !this.#options.canToggle?.()) return;
        const abortController = new AbortController();
        this.#dialog.showModal();
        if (this.#options.lightDismiss) {
            this.#dialog.addEventListener("click", (event)=>{
                if (!(event instanceof MouseEvent) || (0, $a4743415ed687ae4$export$2e2bcd8739ae039)(event, this.#dialog)) return;
                this.#dialog.close();
            }, {
                signal: abortController.signal
            });
            setTimeout(()=>{
                this.#dialog.getRootNode().addEventListener("click", (event)=>{
                    if (!(event.target instanceof Node) || !this.#dialog.contains(event.target)) return;
                    this.#dialog.close();
                }, {
                    signal: abortController.signal
                });
                this.#dialog.addEventListener("close", ()=>abortController.abort(), {
                    signal: abortController.signal
                });
            }, 0);
        }
        this.#options.onToggle?.();
    }
    hide() {
        if (this.#dialog.matches(":not(:modal)") || !this.#options.canToggle?.()) return;
        this.#dialog.close();
        this.#options.onToggle?.();
    }
    toggle() {
        if (this.#dialog.matches(":modal")) this.hide();
        else this.show();
    }
}


class $9f887c14bb5fffd1$export$2e2bcd8739ae039 extends HTMLElement {
    /** @type {string | null} */ #target = null;
    /** @type {'toggle' | 'show' | 'hide'} */ #targetAction = "toggle";
    /** @type {boolean} */ #lightDismiss = false;
    /** @type {ModalController | undefined} */ #controller;
    static observedAttributes = [
        "target",
        "target-action",
        "light-dismiss"
    ];
    /**
   * @param {string}  name
   * @param {string | undefined}     _oldVal
   * @param {string | undefined}     newVal
   */ attributeChangedCallback(name, _oldVal, newVal) {
        if (name === "target") this.#target = newVal || null;
        if (name === "target-action" && newVal && [
            "toggle",
            "show",
            "hide"
        ].includes(newVal)) this.#targetAction = /** @type {'toggle' | 'show' | 'hide'} */ newVal;
        if (name === "light-dismiss") this.#lightDismiss = newVal !== undefined;
        if (name === "target" || name === "light-dismiss") {
            const root = this.getRootNode();
            const { targetElement: targetElement } = this;
            if (targetElement instanceof HTMLDialogElement && (root instanceof Document || root instanceof ShadowRoot)) this.#controller = new (0, $7d0ee5e0ea3ca1f6$export$2e2bcd8739ae039)(targetElement, {
                lightDismiss: this.#lightDismiss,
                canToggle: ()=>this.#dispatchBeforeToggle(),
                onToggle: ()=>this.#dispatchToggle()
            });
        }
    }
    /**
   * ID of the target `<dialog>`
   * @type {string|null}
   */ get target() {
        return this.#target;
    }
    set target(value) {
        this.#target = value;
        if (value === null) this.removeAttribute("target");
        else this.setAttribute("target", value);
    }
    /**
   * What should happen to the dialog when clicking the control (default: 'toggle')
   * @type {'toggle'|'show'|'hide'}
   */ get targetAction() {
        return this.#targetAction;
    }
    set targetAction(value) {
        if (!value) return;
        this.#targetAction = value;
        if (value === null) this.removeAttribute("target-action");
        else this.setAttribute("target-action", value);
    }
    /**
   * Determines how the user can close the target modal
   * @type {boolean}
   */ get lightDismiss() {
        return this.#lightDismiss;
    }
    set lightDismiss(value) {
        this.#lightDismiss = Boolean(value);
        if (this.#lightDismiss) this.setAttribute("light-dismiss", "");
        else this.removeAttribute("light-dismiss");
    }
    /** @type {HTMLDialogElement|null} */ get targetElement() {
        const root = /** @type {Document|ShadowRoot} */ this.getRootNode();
        const el = this.target ? root.getElementById(this.target) : null;
        if (!(el instanceof HTMLDialogElement)) return null;
        return el;
    }
    connectedCallback() {
        this.addEventListener("click", this.#handleClick);
    }
    disconnectedCallback() {
        this.removeEventListener("click", this.#handleClick);
    }
    /** @returns {boolean} */ #dispatchBeforeToggle() {
        return this.dispatchEvent(new Event("modal-control-before-toggle", {
            cancelable: true
        }));
    }
    /** @returns {boolean} */ #dispatchToggle() {
        return this.dispatchEvent(new Event("modal-control-toggle"));
    }
    /**
   * @param {MouseEvent} event
   * @returns {void}
   */ #handleClick = (event)=>{
        const target = /** @type {Element} */ event.target;
        if (!target.closest('button, input[type="button"]')) return;
        switch(this.targetAction){
            case "show":
                this.#controller?.show();
                break;
            case "hide":
                this.#controller?.hide();
                break;
            case "toggle":
                this.#controller?.toggle();
                break;
        }
    };
}



/**
 * @param {string} [name]
 * @returns {void}
 */ const $d832f2ef8a5ce6ac$export$f36d6a7a5c09a23e = (name = "modal-control")=>{
    if ("customElements" in window) customElements.define(name, (0, $9f887c14bb5fffd1$export$2e2bcd8739ae039));
};


export {$d832f2ef8a5ce6ac$export$f36d6a7a5c09a23e as define, $9f887c14bb5fffd1$export$2e2bcd8739ae039 as ModalControlElement, $7d0ee5e0ea3ca1f6$export$2e2bcd8739ae039 as ModalController};
//# sourceMappingURL=index.js.map
