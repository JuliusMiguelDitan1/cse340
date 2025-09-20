const errorController = {}

// Controller to intentionally throw a 500 error
errorController.throwError = (req, res, next) => {
  try {
    // Intentionally throw an error
    throw new Error("Intentional 500-type server error triggered!")
  } catch (err) {
    next(err) // pass to global error handler
  }
}

module.exports = errorController
