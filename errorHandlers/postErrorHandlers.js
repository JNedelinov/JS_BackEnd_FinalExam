

const postErrorHandler = (error) => {
    const errors = [];

  // errors for required fields
  if (error.message.includes("post validation failed")) {
    Object.values(error.errors).forEach((err, index) => {
      errors.push(err.properties.message);
    });
    return errors;
  }

  // duplication error
  if (error.code === 11000) {
    errors.push("There is already a post with that title");
    return errors;
  }

  // !NOT_VALIDATION_ERRORS - MOST_LIKELY_FOR_THE_EDIT_PAGE

  // empty fields error
  if (error.message === "All fields are required") {
    errors.push("All fields are required");
  }

  // empty title error
  if (error.message === "The title must be at least 4 characters long") {
    errors.push("The title must be at least 4 characters long");
  }

  // description less than 20 chars
  if (error.message === "Description's length should be at least 20 characters") {
    errors.push("Description's length should be at least 20 characters");
  }

  // invalid image url
  if (error.message === "Enter a valid Url for the image") {
    errors.push("Enter a valid Url for the image");
  }

  // invalid duration
  if (error.message === "Invalid entered duration. It should be like this - 4 weeks") {
    errors.push("Invalid entered duration. It should be like this - 4 weeks");
  }

  return errors;
}

module.exports = {
    postErrorHandler
}