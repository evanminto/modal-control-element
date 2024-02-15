/**
 * @param {MouseEvent}  event
 * @param {HTMLElement} element
 * @returns {boolean}
 */ function $a4743415ed687ae4$export$2e2bcd8739ae039(event, element) {
    const { clientX: clientX, clientY: clientY } = event;
    const target = /** @type {HTMLElement} */ event.target;
    const { x: x, y: y, width: width, height: height } = element.getBoundingClientRect();
    return element.contains(target) || clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height;
}


class $9f887c14bb5fffd1$export$2e2bcd8739ae039 extends HTMLElement {
    /** @type {string | null} */ #target = null;
    /** @type {'toggle' | 'show' | 'hide'} */ #targetAction = "toggle";
    /** @type {boolean} */ #lightDismiss = false;
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
        const { targetElement: targetElement } = this;
        if (!targetElement) return;
        switch(this.targetAction){
            case "show":
                if (!targetElement.open && this.#dispatchBeforeToggle()) {
                    targetElement.showModal();
                    if (this.lightDismiss) this.#listenOnClickOutside(targetElement);
                    this.#dispatchToggle();
                }
                break;
            case "hide":
                if (targetElement.open && this.#dispatchBeforeToggle()) {
                    targetElement.close();
                    this.#dispatchToggle();
                }
                break;
            case "toggle":
                if (this.#dispatchBeforeToggle()) {
                    if (targetElement.open) targetElement.close();
                    else {
                        targetElement.showModal();
                        if (this.lightDismiss) this.#listenOnClickOutside(targetElement);
                    }
                    this.#dispatchToggle();
                }
        }
    };
    /**
   * @param {MouseEvent & { target: HTMLDialogElement }} event
   */ #handleClickTarget = (event)=>{
        const { targetElement: targetElement } = this;
        if (targetElement && !(0, $a4743415ed687ae4$export$2e2bcd8739ae039)(event, targetElement) && this.#dispatchBeforeToggle()) {
            targetElement.close();
            this.#dispatchToggle();
        }
    };
    /**
   * @param {MouseEvent & { target: HTMLDialogElement }} event
   */ #handleClickRoot = (event)=>{
        const { targetElement: targetElement } = this;
        if (targetElement && !targetElement.contains(event.target) && this.#dispatchBeforeToggle()) {
            targetElement.close();
            this.#dispatchToggle();
        }
    };
    /**
   * @param {Event & { target: HTMLDialogElement }} event
   */ #handleCloseTarget = (event)=>{
        // @ts-ignore
        event.target.removeEventListener("click", this.#handleClickTarget);
        // @ts-ignore
        event.target.getRootNode().removeEventListener("click", this.#handleClickRoot);
        // @ts-ignore
        event.target.removeEventListener("close", this.#handleCloseTarget);
    };
    /**
   * @param {HTMLDialogElement | null} dialog
   */ #listenOnClickOutside(dialog) {
        if (!dialog) return;
        // @ts-ignore
        dialog.addEventListener("click", this.#handleClickTarget);
        setTimeout(()=>{
            // @ts-ignore
            dialog.getRootNode().addEventListener("click", this.#handleClickRoot);
            // @ts-ignore
            dialog.addEventListener("close", this.#handleCloseTarget);
        }, 0);
    }
}


/**
 * @param {string} [name]
 * @returns {void}
 */ const $d832f2ef8a5ce6ac$export$f36d6a7a5c09a23e = (name = "modal-control")=>{
    if ("customElements" in window) customElements.define(name, (0, $9f887c14bb5fffd1$export$2e2bcd8739ae039));
};


export {$d832f2ef8a5ce6ac$export$f36d6a7a5c09a23e as define, $9f887c14bb5fffd1$export$2e2bcd8739ae039 as ModalControlElement};
//# sourceMappingURL=index.js.map
