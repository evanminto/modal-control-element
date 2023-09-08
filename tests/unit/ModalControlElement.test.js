import { describe, it, expect } from '@jest/globals';
import ModalControlElement from '../../src/ModalControlElement.js';

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