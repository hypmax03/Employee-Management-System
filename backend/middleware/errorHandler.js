const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.message || 'Error occurred');

  // bad object id
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Resource not found with id ${err.value}`
    });
  }

  // duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return res.status(400).json({
      success: false,
      message: `A record with this ${field} ("${value}") already exists.`,
      duplicateField: field
    });
  }

  // validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach((val) => {
      errors[val.path] = val.message;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  // jwt errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.'
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
