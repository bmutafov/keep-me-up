#!/usr/bin/env node
//@ts-check

/** Import nut-js which handles the mouse-moving functionalities */
const { mouse, Point, sleep } = require("@nut-tree/nut-js");
const chalk = require("chalk");
const desktopIdle = require("desktop-idle");
const figlet = require("figlet");
const gradient = require("gradient-string");
const { version } = require("./package.json");

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
 * Transform seconds to display time in the format `HH:mm:ss`
 * @param {number} seconds
 * @returns {string} The display time to be shown
 */
const secondsToDisplayTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

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

/** Returns a figlet welcome heading message */
const getFigletWelcomeMessage = () => {
  return new Promise((resolve, reject) => {
    figlet("SIMPLE-KEEP-PC-AWAKE", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Return information to be written in the header.
 * * To add new info add it to the welcomeSubheading object
 * @returns {Array} Array of strings which follow the {label} : {value} format.
 */
const getWelcomeSubheadings = () => {
  const welcomeSubheading = {
    Version: version,
    Author: "Boris Mutafov",
  };

  return Object.entries(welcomeSubheading).map(([key, value]) => `${key}: ${gradient(["#11998e", "#38ef7d"])(value)}`);
};

// start();
const run = async () => {
  /** Write the heading message with the app name */
  const welcomeMessage = await getFigletWelcomeMessage();
  console.log(gradient(["#FC466B", "#3F5EFB"])(welcomeMessage));

  /** Log the subheading, which includes version, author, and settings */
  console.log(
    [
      ...getWelcomeSubheadings(),
      `Move offset: ${gradient(["#CAC531", "#F3F9A7"])(getMoveOffset().toString() + " pixels")}`,
      `Max idle time: ${gradient(["#CAC531", "#F3F9A7"])(getMaxIdleTime().seconds.toString() + " seconds")}`,
    ].join("  |  ") + "\n"
  );

  /** Save settings so we don't do unnecessary operations */
  const maxIdleTime = getMaxIdleTime();
  const moveOffset = getMoveOffset();

  /** Default value is not idling */
  let isIdle = false;

  /** Set the default idle time label and write it to console */
  const idleTimeString = "Idle time: ";
  process.stdout.write(idleTimeString);

  /** Hide the terminal cursor */
  process.stderr.write("\x1B[?25l");

  for (let i = 0; true; i++) {
    /** Get current system idle time */
    const idleTime = desktopIdle.getIdleTime();

    /** Display the info line and keep it updated every second */
    const displayIdleTime = i < 5 ? "<5" : secondsToDisplayTime(i);
    /** Move the cursor to where the default "Idle time" string ends */
    process.stdout.cursorTo(idleTimeString.length);
    /** Clear everything after */
    process.stdout.clearLine(1);
    /** Write the remaining time */
    process.stdout.write(chalk.yellow(displayIdleTime + "s"));
    /** Write the status label */
    process.stdout.write("  |  Status: ");
    /** Write the status value */
    process.stdout.write(isIdle ? chalk.green("ON") : chalk.red("OFF"));

    /** If we have reached the maximum idle time */
    if (idleTime >= maxIdleTime.seconds) {
      /** Get last position of the cursor and move it by the given offset */
      const prevPosition = await mouse.getPosition();
      const coordinates = new Point(prevPosition.x + moveOffset, prevPosition.y + moveOffset);
      await mouse.setPosition(coordinates);

      /** If the app hasn't been set as idling so far, set it */
      if (!isIdle) {
        isIdle = true;
      }
    }

    /** If the idle time is 0 and the counter is more than 0, it means the user has been active during the last 0 second */
    if (idleTime === 0 && i > 0) {
      /** If the app has been idling, change the status to false*/
      if (isIdle) {
        isIdle = false;
      }

      /**
       * Reset the idle counter.
       * Setting it to -1 because we have i++ in the end of the for, which will return it to 0
       */
      i = -1;
    }

    /** Sleep 1 second */
    await sleep(1_000);
  }
};

run();
