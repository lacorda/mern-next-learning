const { currentDateTime } = require("./index");

const successResponse = (resultCode, title, message, data, maintenance) => ({
  code: resultCode,
  time: currentDateTime(),
  maintenance_info: maintenance || null,
  result: {
    title,
    message,
    data,
  },
});

const errorResponse = (resultCode, title, error, maintenance) => ({
  code: resultCode,
  time: currentDateTime(),
  maintenance_info: maintenance || null,
  result: {
    title,
    error,
  },
});

module.exports = {
  successResponse,
  errorResponse,
};
