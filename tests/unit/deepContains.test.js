import { describe, it, expect } from 'vitest';
import { deepContains } from '../../src/deepContains.js';

describe('deepContains', () => {
  describe('simple parent-child', () => {
    it('returns true', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);
      document.body.appendChild(parent);
      expect(deepContains(parent, child)).toBe(true);
    });
  });

  describe('two levels down', () => {
    it('returns true', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      const grandchild = document.createElement('div');
      child.appendChild(grandchild);
      parent.appendChild(child);
      document.body.appendChild(parent);
      expect(deepContains(parent, grandchild)).toBe(true);
    });
  });

  describe('siblings', () => {
    it('returns false', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      document.body.appendChild(parent);
      document.body.appendChild(child);
      expect(deepContains(parent, child)).toBe(false);
    });
  });

  describe('in Shadow DOM', () => {
    it('returns true', () => {
      document.body.innerHTML = `<div></div>`;

      const parent = document.querySelector('div');
      const shadow = parent?.attachShadow({ mode: 'open' });
      
      if (shadow) {
        shadow.innerHTML = `<div></div>`;
      }

      const child = shadow?.querySelector('div');

      expect(parent).toBeInstanceOf(HTMLDivElement);
      expect(child).toBeInstanceOf(HTMLDivElement);

      // @ts-ignore
      expect(deepContains(parent, child)).toBe(true);
    });
  });

  describe('in two layers of Shadow DOM', () => {
    it('returns true', () => {
      document.body.innerHTML = `<div id="parent"></div>`;

      const parent = document.querySelector('div');
      const shadow = parent?.attachShadow({ mode: 'open' });
      
      if (shadow) {
        shadow.innerHTML = `<div id="child"></div>`;
      }

      const child = shadow?.querySelector('div');
      const childShadow = child?.attachShadow({ mode: 'open' });

      if (childShadow) {
        childShadow.innerHTML = `<div id="grandchild"></div>`;
      }

      const grandchild = childShadow?.querySelector('div');

      expect(parent).toBeInstanceOf(HTMLDivElement);
      expect(grandchild).toBeInstanceOf(HTMLDivElement);

      // @ts-ignore
      expect(deepContains(parent, grandchild)).toBe(true);
    });
  });
});