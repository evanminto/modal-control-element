/**
 * Checks if an ancestor node contains a descendant node, crossing shadow
 * boundaries
 * @param {Node} ancestor
 * @param {Node} descendant
 */ function $9d121dc88146ccd1$export$273cb3019e2f952c(ancestor, descendant) {
    // First, check via normal contains (fastest, but doesn't work with shadow
    // roots)
    if (ancestor.contains(descendant)) return true;
    // This could be a shadow root or a document
    const root = descendant.getRootNode();
    if (root instanceof ShadowRoot) // Check the host of the shadow root
    return $9d121dc88146ccd1$export$273cb3019e2f952c(ancestor, root.host);
    // If it's not a shadow root and contains() returned false, it's definitely
    // not a match
    return false;
}



function $a4743415ed687ae4$export$2e2bcd8739ae039(event, dialog) {
    const { clientX: clientX, clientY: clientY } = event;
    const target = /** @type {Node} */ event.target;
    const { x: x, y: y, width: width, height: height } = dialog.getBoundingClientRect();
    // If the target IS the dialog, check that the event is inside the bounds. A
    // click on the backdrop of a dialog will appear as a click on the dialog
    // itself, but will be outside the bounds.
    if (dialog === target) return clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height;
    // If the target isn't the dialog itself, check that it's inside the dialog
    return (0, $9d121dc88146ccd1$export$273cb3019e2f952c)(dialog, target);
}


class $7d0ee5e0ea3ca1f6$export$2e2bcd8739ae039 {
    #dialogOrGetter;
    #options;
    /**
   * @param {HTMLDialogElement | (() => HTMLDialogElement?)} dialog Element or getter
   * @param {ModalOptions} [options]
   */ constructor(dialog, options){
        const defaultOptions = {
            canToggle: ()=>true
        };
        this.#dialogOrGetter = dialog;
        this.#options = Object.assign(defaultOptions, options);
    }
    show() {
        const dialog = this.#getDialog();
        if (!dialog || dialog.matches(":modal") || !this.#options.canToggle?.()) return;
        const abortController = new AbortController();
        dialog.showModal();
        if (this.#options.lightDismiss) {
            dialog.addEventListener("click", (event)=>{
                if (!(event instanceof MouseEvent) || (0, $a4743415ed687ae4$export$2e2bcd8739ae039)(event, dialog)) return;
                this.hide();
            }, {
                signal: abortController.signal
            });
            setTimeout(()=>{
                const root = dialog.getRootNode();
                /** @param {Event} event */ const handleClickDirectRoot = (event)=>{
                    // If the click is inside the dialog, ignore it
                    if (!(event instanceof MouseEvent) || (0, $a4743415ed687ae4$export$2e2bcd8739ae039)(event, dialog)) return;
                    this.hide();
                };
                if (root instanceof ShadowRoot) {
                    root.addEventListener("click", handleClickDirectRoot, {
                        signal: abortController.signal
                    });
                    dialog.getRootNode({
                        composed: true
                    }).addEventListener("click", (event)=>{
                        // If the target is an ancestor of the dialog, ignore the click
                        // (the shadow click handler should take care of anything inside
                        // the target that's not the dialog)
                        if (!(event.target instanceof Node) || (0, $9d121dc88146ccd1$export$273cb3019e2f952c)(event.target, dialog)) return;
                        this.hide();
                    }, {
                        signal: abortController.signal
                    });
                } else root.addEventListener("click", handleClickDirectRoot, {
                    signal: abortController.signal
                });
                dialog.addEventListener("close", ()=>abortController.abort(), {
                    signal: abortController.signal
                });
            }, 0);
        }
        this.#options.onToggle?.();
    }
    hide() {
        const dialog = this.#getDialog();
        if (!dialog || dialog.matches(":not(:modal)") || !this.#options.canToggle?.()) return;
        dialog.close();
        this.#options.onToggle?.();
    }
    toggle() {
        if (this.#getDialog()?.matches(":modal")) this.hide();
        else this.show();
    }
    #getDialog() {
        if (typeof this.#dialogOrGetter === "function") return this.#dialogOrGetter();
        return this.#dialogOrGetter;
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
        if (name === "target" || name === "light-dismiss") this.#initController();
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
        this.#initController();
    }
    disconnectedCallback() {
        this.removeEventListener("click", this.#handleClick);
    }
    #initController() {
        const root = this.getRootNode();
        if (root instanceof Document || root instanceof ShadowRoot) this.#controller = new (0, $7d0ee5e0ea3ca1f6$export$2e2bcd8739ae039)(()=>this.targetElement, {
            lightDismiss: this.#lightDismiss,
            canToggle: ()=>this.#dispatchBeforeToggle(),
            onToggle: ()=>this.#dispatchToggle()
        });
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
