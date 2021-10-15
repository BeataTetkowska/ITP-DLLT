module.exports = {
  toBeFalse(received) {
    const pass = received === false;
    if (pass) {
      return {
        message: () => `expected ${received} not to be false`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be false`,
        pass: false,
      };
    }
  },
};
