class ConflictError extends Error {
  constructor(messege) {
    super(messege);
    this.statusCode = 409;
  }
}
module.exports = ConflictError;
