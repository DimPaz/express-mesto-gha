class PageNotFoundError extends Error {
  constructor(messege) {
    super(messege);
    this.statusCode = 404;
  }
}
module.exports = PageNotFoundError;
