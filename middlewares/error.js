module.exports = (error, req, res, next) => {
  /*
     We Can have here more logic of how to log the errors (Eg: Winston)
     and How to tagel Specific errors
    */
  if (res.headersSent) {
    return next(error);
  }
  const status = error.status ? error.status : 500;
  const message = error.message ? error.message : "Something Went Wrong !";

  return res.status(status).send({ message });
};
