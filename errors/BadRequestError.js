class BadRequestError extends Error {
  constructor(messege) {
    super(messege);
    this.statusCode = 400;
  }
}
module.exports = BadRequestError;
