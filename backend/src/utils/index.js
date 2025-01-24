const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const FileStreamRotator = require("file-stream-rotator");

const currentDateTime = () => {
  const date = new Date();
  const currentDataTime = date.toLocaleString([], { hour12: true });

  return currentDataTime;
};

const makeDir = (dir) => {
  let path = appRoot;

  const dirs = dir.split("/");
  for (let i = 0; i < dirs.length - 1; i++) {
    path += `/${dirs[i]}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  return path;
};

const createLogStream = ({
  date_format,
  dir,
  filename,
  frequency,
  verbose,
}) => {
  const LOGS_FOLDER = makeDir(dir);

  return FileStreamRotator.getStream({
    date_format: date_format || "YYYY-MM-DD",
    filename: path.join(LOGS_FOLDER, filename),
    frequency: frequency || "daily",
    verbose: verbose || false,
  });
};

module.exports = {
  currentDateTime,
  makeDir,
  createLogStream,
};
