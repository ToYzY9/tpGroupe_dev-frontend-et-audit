import { sum } from './sum';
import { describe, test, expect } from 'vitest';

describe('addition', () => {
  test('additionne deux nombres 1 + 2 font 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

