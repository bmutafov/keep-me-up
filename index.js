#!/usr/bin/env node
//@ts-check

/** Import nut-js which handles the mouse-moving functionalities */
const { mouse, Point } = require("@nut-tree/nut-js");
const desktopIdle = require("desktop-idle");

/** Read the command line arguments */
const args = process.argv.slice(2);

const DEFAULTS = {
  OFFSET_PX: 1,
  MAX_IDLE_SEC: 120,
};

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

/**
 * Searches the args for --quiet param and if found should return true to surpass console.logs
 */
const isQuietMode = args.some((arg) => arg === "--quiet");

/**
 * console.logs the message if quiet mode is off
 * @param {string} message
 */
const log = (message) => (!isQuietMode ? console.log(message) : null);

/**
 * Extracts argument from the process args with the key provided
 * @param {string} param Key of the extracted value
 * @param {number} defaultValue Default value to be used if no such value is found.
 * @returns
 */
const getArgParam = (param, defaultValue) => {
  /** Find the arg index which corresponds to the param provided */
  const paramTagIndex = args.findIndex((arg) => arg === param);
  if (paramTagIndex < 0) return defaultValue;

  /** Get the next element in the array, so we know the value of the param */
  const paramValueIndex = paramTagIndex + 1;

  /** If there is such value after param tag */
  if (args[paramValueIndex]) {
    /** Try to parse it to float */
    const paramValueAsFloat = parseFloat(args[paramValueIndex]);

    /** If it is not a valid number, return the default value */
    if (isNaN(paramValueAsFloat)) {
      return defaultValue;
    } else {
      /** Else return the user-configured value */
      return paramValueAsFloat;
    }
  }

  /** Default return, if no arg after --offset is provided */
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
 * @typedef {Object} IMaxIdleTime
 * @property {number} seconds - The time which the computer can stay idle in seconds
 * @property {number} milliseconds - The time which the computer can stay idle in milliseconds
 *
 * Extracts the interval value from the --max-idle argument
 * @returns {IMaxIdleTime} Amount of MS to wait before moving the cursor after system is idle. User defined or default.
 */
const getMaxIdleTime = () => {
  const maxIdleTime = getArgParam("--max-idle", DEFAULTS.MAX_IDLE_SEC);

  return {
    seconds: maxIdleTime,
    milliseconds: maxIdleTime * 1_000,
  };
};

/**
 * Moves the mouse cursor by X amount of pixels
 * @param {number} offset How many pixels should the mouse be moved by
 * @param {IMaxIdleTime} maxIdleTime How many milliseconds to wait before moving the mouse again
 */
const keepAwake = async (offset, maxIdleTime) => {
  /** Check if the idle time of the machine is higher than the max idle time */
  if (desktopIdle.getIdleTime() >= maxIdleTime.seconds) {
    log(`💤\x1b[33m ${now()}\x1b[0m  System idling... Moving mouse`);

    /** Get last position of the cursor and move it by the given offset */
    const prevPosition = await mouse.getPosition();
    const coordinates = new Point(prevPosition.x + offset, prevPosition.y + offset);
    await mouse.setPosition(coordinates);
  }

  /** Call the function recursively again to check after the max idle time */
  setTimeout(() => {
    /** Multiply offset by -1 to switch between 2 positions of the cursor (move it one direction and then back the same direction) */
    keepAwake(offset * -1, maxIdleTime);
  }, maxIdleTime.milliseconds);
};

/** Executed on startup. Should start all needed utilities for the wake keeper. */
const start = () => {
  const moveOffset = getMoveOffset();
  const maxIdleTime = getMaxIdleTime();

  log("🚀\x1b[32m success   \x1b[0mStarted simple-keep-pc-awake");
  log(`⚙ \x1b[34m info      \x1b[0mMouse move offset:     ${moveOffset} pixels`);
  log(`⚙ \x1b[34m info      \x1b[0mMax idle time:         ${maxIdleTime.seconds} seconds`);

  keepAwake(moveOffset, maxIdleTime);
};

start();
