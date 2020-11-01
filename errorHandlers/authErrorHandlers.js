const authErrorHandler = (error) => {
    const errors = [];

  // user validation error
  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors.push(properties.message);
    });
    return errors;
  }

  // duplication error
  if (error.code === 11000) {
    errors.push("This username is already registered");
    return errors;
  }

  // !NOT_VALIDATION_ERRORS - MOST_LIKELY_LOGGING_ERRORS

  // wrong username or password
  if (error.message === "Wrong username or password") {
    errors.push(error.message);
    return errors;
  }

  // missing username
  if (error.message === "This username is already registered") {
    errors.push("This username is already registered");
  }

  // if passwords don't match
  if (error.message === "Passwords don't match") {
    errors.push("Passwords don't match");
  }

  // if password not repeated
  if (error.message === "Please repeat the password") {
    errors.push("Please repeat the password");
  }

  return errors;
}

module.exports = {
    authErrorHandler
}