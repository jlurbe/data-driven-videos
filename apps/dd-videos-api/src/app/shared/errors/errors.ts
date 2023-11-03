const createErrorFactory = function (name) {
  return class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = name;
    }
  };
};

export const GSheetsError = createErrorFactory('GSheetsError');
export const ProcessVideoError = createErrorFactory('ProcessVideoError');
