(()=>{class t extends HTMLElement{#t=null;#e=null;static observedAttributes=["target","target-action"];attributeChangedCallback(t,e,i){"target"===t&&(this.#t=i),"target-action"===t&&(this.#e=i)}get target(){return this.#t}set target(t){this.#t=t,null===t?this.removeAttribute("target"):this.setAttribute("target",t)}get targetAction(){return this.#e}set targetAction(t){this.#e=t,null===t?this.removeAttribute("target-action"):this.setAttribute("target-action",t)}get targetElement(){let t=this.getRootNode(),e=this.target?t.getElementById(this.target):null;return e instanceof HTMLDialogElement?e:null}connectedCallback(){this.addEventListener("click",this.#i)}disconnectedCallback(){this.removeEventListener("click",this.#i)}#s(){return this.dispatchEvent(new Event("modal-control-before-toggle",{cancelable:!0}))}#a(){return this.dispatchEvent(new Event("modal-control-toggle"))}#i=t=>{let e=t.target;if(!e.closest('button, input[type="button"]'))return;let{targetElement:i}=this;if(i)switch(this.targetAction){case"show":!i.open&&this.#s()&&(i.showModal(),this.#a());break;case"hide":i.open&&this.#s()&&(i.close(),this.#a());break;case"toggle":this.#s()&&(i.open?i.close():i.showModal(),this.#a())}}}((e="modal-control")=>{"customElements"in window&&customElements.define(e,t)})()})();
//# sourceMappingURL=global.js.map