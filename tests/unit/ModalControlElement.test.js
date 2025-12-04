import { describe, it, expect, beforeEach } from 'vitest';
import ModalControlElement from '../../src/ModalControlElement.js';

customElements.define('modal-control', ModalControlElement);

describe('ModalControlElement', () => {
  describe('target', () => {
    it('getter and setter works', () => {
      const control = new ModalControlElement();
      control.target = 'foo';
      expect(control.target).toBe('foo');
    });
  });

  describe('targetAction', () => {
    it('getter and setter works', () => {
      const control = new ModalControlElement();
      control.targetAction = 'toggle';
      expect(control.targetAction).toBe('toggle');
    });
  });
});