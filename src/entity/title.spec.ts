import { describe, expect, it } from 'vitest';
import { Title } from './title';

describe('Title', () => {
  it('should create an instance', () => {
    expect({} as Title).toBeTruthy();
  });
});
