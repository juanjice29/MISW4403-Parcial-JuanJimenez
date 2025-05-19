export class BusinessLogicException extends Error {
  type: number;

  constructor(message: string, type: number) {
    super(message);
    this.name = 'BusinessLogicException';
    this.type = type;

    // Set the prototype explicitly (necesario para algunas versiones de TS/JS)
    Object.setPrototypeOf(this, BusinessLogicException.prototype);
  }
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST
}

/* archivo: src/shared/errors/business-errors.ts */
