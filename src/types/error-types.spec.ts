import { describe, expect, it } from 'vitest';
import { InvalidAccessError, OperationError } from './error-types';

describe('error-types', () => {
  describe('InvalidAccessError', () => {
    it('should create an instance with correct name and message', () => {
      const error = new InvalidAccessError('Test error message');
      expect(error).toBeInstanceOf(InvalidAccessError);
      expect(error.name).toBe('InvalidAccessError');
      expect(error.message).toBe('Test error message');
    });
  });

  describe('OperationError', () => {
    it('should create an instance with correct name and message', () => {
      const error = new OperationError('Test error message');
      expect(error).toBeInstanceOf(OperationError);
      expect(error.name).toBe('OperationError');
      expect(error.message).toBe('Test error message');
    });
  });
});
