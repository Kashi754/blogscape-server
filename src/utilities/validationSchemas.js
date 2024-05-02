//TODO: Add proper validation and sanitization

exports.authSchema = {
  registration: {
    email: {
      isEmail: true,
      normalizeEmail: {
        all_lowercase: true,
      },
      errorMessage: 'Invalid email address',
    },
    username: {
      isAlphanumeric: true,
      errorMessage: 'Invalid username',
    },
    blogTitle: {
      exists: true,
      errorMessage: 'Invalid blog title',
    },
    password: {
      exists: true,
    },
  },
  login: {
    username: {
      exists: true,
      errorMessage: 'Incorrect username or password',
    },
    password: {
      exists: true,
      errorMessage: 'Incorrect username or password',
    },
  },
};
