module.exports = {
  toBeTrue(received) {
    const pass = received === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be true`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be true`,
        pass: false,
      };
    }
  },
};
