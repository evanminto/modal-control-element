# Modal Control Element
Tiny, framework-agnostic, dependency-free Custom Element that turns a button
into a control for a modal &lt;dialog> element. Inspired by the native [Popover
API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API).

## Installation

```sh
npm install @evanminto/modal-control-element --save
```

### HTML

```html
<script src="path/to/@evanminto/modal-control-element/dist/global.js" defer>
```

### ES Modules

You can also load the component directly in your JavaScript, which allows you to define your own custom name for the element or control the timing of module loading and custom element definition.

```js
import { ModalControlElement } from '@evanminto/modal-control-element';

customElements.define('modal-control-element', ModalControlElement);
```

## Usage

Wrap a `<modal-control>` element around a `<button>` or `<input type="button">`
to turn the element into a control for a `<dialog>` element. When clicked, the
dialog will open as a modal, using the
[`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)
method.

**Note:** This element does not support opening dialogs non-modally. If you need non-modal behavior, consider using the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) which has a similar declarative API.

### Basic

```html
<modal-control target="my_dialog">
  <button type="button">Toggle</button>
</modal-control>

<dialog id="my_dialog">
  <!-- Custom content -->
</dialog>
```

### Dedicated Show and Hide Buttons

```html
<modal-control
  target="my_dialog"
  target-action="show"
>
  <button type="button">Show</button>
</modal-control>

<dialog id="my_dialog">
  <modal-control
    target="my_dialog"
    target-action="hide"
  >
    <button type="button">Hide</button>
  </modal-control>

  <!-- Custom content -->
</dialog>
```

### Light Dismiss

By default, a modal can be closed via an explicit close button or the escape
key. To add full “light dismiss” functionality, namely the ability to close it
by clicking outside the modal, add the `light-dismiss` attribute:

```html
<modal-control target="my_dialog" light-dismiss>
  <button type="button">Toggle</button>
</modal-control>

<dialog id="my_dialog">
  <!-- Custom content -->
</dialog>
```

Clicking the modal’s backdrop or any other element on the page will close the
modal, but clicking inside the modal will not.

## Attributes

### light-dismiss

Boolean attribute. If present, turns on light dismiss features.

### target

ID of the target `<dialog>`

### target-action

What should happen to the dialog when clicking the control?

**Values:** `toggle` (default), `show`, `hide`

## Properties

### lightDismiss

Reflects the `light-dismiss` attribute as a boolean.

### target

Reflects the `target` attribute.

### targetAction

Reflects the `target-action` attribute.

## Events

### modal-control-before-toggle

Fires before the dialog state changes. If canceled, the state change will be
canceled.

### modal-control-toggle

Fires after the dialog state changes.
