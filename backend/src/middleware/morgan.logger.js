const morgan = require("morgan");
const { createLogStream } = require("../utils");

const morganLogger = () => {
  const logStream = createLogStream({
    dir: "/logs/access",
    filename: "access-%DATE%.log",
  });

  return morgan("combined", { stream: logStream });
};

module.exports = morganLogger;
