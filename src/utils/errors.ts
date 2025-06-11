export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParsingError';
  }
}
