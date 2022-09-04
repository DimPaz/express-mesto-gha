class ForbiddenError extends Error {
  constructor(messege) {
    super(messege);
    this.statusCode = 403;
  }
}
module.exports = ForbiddenError;
