#!/usr/bin/env node
//@ts-check

// Import nut-js which handles the mouse-moving functionalities
const { mouse, Point } = require("@nut-tree/nut-js");

// Read the command line arguments
const args = process.argv.slice(2);

const DEFAULTS = {
  OFFSET_PX: 1,
  INTERVAL_SEC: 30,
};

//#region time-helpers
/**
 * Representing the digits in a double digit format (0 to 00, 8 to 08, 12 to 12, etc.);
 * @param {number} digit
 * @returns {string} Representing the digits in a double digit format (0 to 00, 8 to 08, 12 to 12, etc.);
 */
const toDoubleDigit = (digit) => {
  const digitAsString = digit.toString();
  if (digitAsString.length > 1) return digitAsString;

  return `0${digit}`;
};

/**
 * Returns the current date as HH:mm:ss format
 * @returns {string} HH:mm:ss format of the current date
 */
const now = () => {
  const dateNow = new Date();
  const hours = toDoubleDigit(dateNow.getHours());
  const minutes = toDoubleDigit(dateNow.getMinutes());
  const seconds = toDoubleDigit(dateNow.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
};
//#endregion

//#region args-parser-helpers

/**
 * Extracts argument from the process args with the key provided
 * @param {string} param Key of the extracted value
 * @param {number} defaultValue Default value to be used if no such value is found.
 * @returns
 */
const getArgParam = (param, defaultValue) => {
  // Find the arg index which corresponds to the param provided
  const paramTagIndex = args.findIndex((arg) => arg === param);
  if (paramTagIndex < 0) return defaultValue;

  // Get the next element in the array, so we know the value of the param
  const paramValueIndex = paramTagIndex + 1;

  // If there is such value after param tag
  if (args[paramValueIndex]) {
    // Try to parse it to float
    const paramValueAsFloat = parseFloat(args[paramValueIndex]);

    // If it is not a valid number, return the default value
    if (isNaN(paramValueAsFloat)) {
      return defaultValue;
    }
    // Else return the user-configured value
    else {
      return paramValueAsFloat;
    }
  }

  // Default return, if no arg after --offset is provided
  return defaultValue;
};

/**
 * Extracts the offset value from the --offset argument
 * @returns {number} Amount of pixels to move the cursor by. User defined or default.
 */
const getMoveOffset = () => {
  return getArgParam("--offset", DEFAULTS.OFFSET_PX);
};

/**
 * Extracts the interval value from the --interval argument
 * @returns {number} Amount of MS to wait before moving the cursor again. User defined or default.
 */
const getMoveInterval = () => {
  return getArgParam("--interval", DEFAULTS.INTERVAL_SEC) * 1_000;
};

/**
 * Searches the args for --quiet param and if found should return true to surpass console.logs
 */
const isQuietMode = args.some((arg) => arg === "--quiet");
//#endregion

/**
 * console.logs the message if quiet mode is off
 * @param {string} message
 */
const log = (message) => (!isQuietMode ? console.log(message) : null);

/**
 * Moves the mouse cursor by X amount of pixels
 * @param {number} offset How many pixels should the mouse be moved by
 * @param {number} interval How many milliseconds to wait before moving the mouse again
 */
const mouseMover = async (offset, interval) => {
  log(`\x1b[33m${now()}\x1b[0m Moved mouse cursor by ${offset} pixels`);

  const prevPosition = await mouse.getPosition();
  const coordinates = new Point(prevPosition.x + offset, prevPosition.y + offset);
  await mouse.setPosition(coordinates);

  setTimeout(() => {
    mouseMover(offset * -1, interval);
  }, interval);
};

const moveOffset = getMoveOffset();
const moveInterval = getMoveInterval();

log("\x1b[32m 🚀 Started simple-keep-pc-awake...\x1b[0m");
log(`\x1b[34m INFO \x1b[0m Moving mouse cursor by ${moveOffset} pixels`);
log(`\x1b[34m INFO \x1b[0m Moving mouse cursor every ${moveInterval / 1_000} seconds`);

mouseMover(moveOffset, moveInterval);
