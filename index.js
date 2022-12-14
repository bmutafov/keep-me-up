#!/usr/bin/env node
//@ts-check

/** Import nut-js which handles the mouse-moving functionalities */
const { mouse, Point, sleep } = require("@nut-tree/nut-js");
const { version } = require("./package.json");

const colored = {
  yellow: (text) => `\x1b[33m` + text + `\x1b[0m`,
  green: (text) => `\x1b[32m` + text + `\x1b[0m`,
  red: (text) => `\x1b[31m` + text + `\x1b[0m`,
};

/** Read the command line arguments */
const args = process.argv.slice(2);

const DEFAULTS = {
  OFFSET_PX: 1,
  INTERVAL: 60,
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

  /** Default return, if no arg after --default value is provided */
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
 * @typedef {Object} ITimeInterval
 * @property {number} seconds - The time which the computer can stay idle in seconds
 * @property {number} milliseconds - The time which the computer can stay idle in milliseconds
 *
 * Extracts the interval value from the --max-idle argument
 * @returns {ITimeInterval} Amount of MS to wait before moving the cursor after system is idle. User defined or default.
 */
const getIdleTimeInterval = () => {
  const intervalTime = getArgParam("--interval", DEFAULTS.INTERVAL);

  return {
    seconds: intervalTime,
    milliseconds: intervalTime * 1_000,
  };
};

/**
 * Determines if --random tag is provided
 * @returns {boolean} If --random tag is provided in process.args
 */
const getIsRandom = () => {
  return args.includes("--random");
};

/** Returns a figlet welcome heading message */
const getFigletWelcomeMessage = () => {
  const figletMessage = `     [38;2;255;249;91m_[39m  [38;2;255;248;90m_[39m[38;2;255;248;90m_[39m                 [38;2;255;247;89m_[39m[38;2;255;246;89m_[39m  [38;2;255;246;88m_[39m[38;2;255;245;88m_[39m        [38;2;255;244;87m_[39m   [38;2;255;243;87m_[39m       [38;2;255;243;86m_[39m 
    [38;2;255;242;86m|[39m [38;2;255;241;85m|[39m[38;2;255;241;85m/[39m [38;2;255;240;84m/[39m[38;2;255;239;84m_[39m[38;2;255;239;83m_[39m[38;2;255;238;83m_[39m  [38;2;255;237;82m_[39m[38;2;255;237;82m_[39m[38;2;255;236;81m_[39m [38;2;255;235;81m_[39m [38;2;255;235;80m_[39m[38;2;255;234;80m_[39m   [38;2;255;233;79m|[39m  [38;2;255;232;79m\\[39m[38;2;255;232;78m/[39m  [38;2;255;231;78m|[39m [38;2;255;230;77m_[39m[38;2;255;230;77m_[39m[38;2;255;229;76m_[39m  [38;2;255;228;76m|[39m [38;2;255;228;75m|[39m [38;2;255;227;75m|[39m [38;2;255;226;74m|[39m[38;2;255;226;74m_[39m [38;2;255;225;73m_[39m[38;2;255;224;73m_[39m [38;2;255;224;72m|[39m [38;2;255;223;71m|[39m
    [38;2;255;222;71m|[39m [38;2;255;221;70m'[39m [38;2;255;221;70m/[39m[38;2;255;220;69m/[39m [38;2;255;219;69m_[39m [38;2;255;219;68m\\[39m[38;2;255;218;68m/[39m [38;2;255;217;67m_[39m [38;2;255;217;67m\\[39m [38;2;255;216;66m'[39m[38;2;255;215;66m_[39m [38;2;255;215;65m\\[39m  [38;2;255;214;65m|[39m [38;2;255;213;64m|[39m[38;2;255;212;64m\\[39m[38;2;255;212;63m/[39m[38;2;255;211;63m|[39m [38;2;255;210;62m|[39m[38;2;255;210;62m/[39m [38;2;255;209;61m_[39m [38;2;255;208;61m\\[39m [38;2;255;208;60m|[39m [38;2;255;207;60m|[39m [38;2;255;206;59m|[39m [38;2;255;206;59m|[39m [38;2;255;205;58m'[39m[38;2;255;204;58m_[39m [38;2;255;204;57m\\[39m[38;2;255;203;57m|[39m [38;2;255;202;56m|[39m
    [38;2;255;201;56m|[39m [38;2;255;201;55m.[39m [38;2;255;200;55m\\[39m  [38;2;255;199;54m_[39m[38;2;255;199;54m_[39m[38;2;255;198;53m/[39m  [38;2;255;197;52m_[39m[38;2;255;197;52m_[39m[38;2;255;196;51m/[39m [38;2;255;195;51m|[39m[38;2;255;195;50m_[39m[38;2;255;194;50m)[39m [38;2;255;193;49m|[39m [38;2;255;192;49m|[39m [38;2;255;192;48m|[39m  [38;2;255;191;48m|[39m [38;2;255;190;47m|[39m  [38;2;255;190;47m_[39m[38;2;255;189;46m_[39m[38;2;255;188;46m/[39m [38;2;255;188;45m|[39m [38;2;255;187;45m|[39m[38;2;255;186;44m_[39m[38;2;255;186;44m|[39m [38;2;255;185;43m|[39m [38;2;255;184;43m|[39m[38;2;255;184;42m_[39m[38;2;255;183;42m)[39m [38;2;255;182;41m|[39m[38;2;255;181;41m_[39m[38;2;255;181;40m|[39m
    [38;2;255;180;40m|[39m[38;2;255;179;39m_[39m[38;2;255;179;39m|[39m[38;2;255;178;38m\\[39m[38;2;255;177;38m_[39m[38;2;255;177;37m\\[39m[38;2;255;176;37m_[39m[38;2;255;175;36m_[39m[38;2;255;175;36m_[39m[38;2;255;174;35m|[39m[38;2;255;173;35m\\[39m[38;2;255;173;34m_[39m[38;2;255;172;33m_[39m[38;2;255;171;33m_[39m[38;2;255;170;32m|[39m [38;2;255;170;32m.[39m[38;2;255;169;31m_[39m[38;2;255;168;31m_[39m[38;2;255;168;30m/[39m  [38;2;255;167;30m|[39m[38;2;255;166;29m_[39m[38;2;255;166;29m|[39m  [38;2;255;165;28m|[39m[38;2;255;164;28m_[39m[38;2;255;164;27m|[39m[38;2;255;163;27m\\[39m[38;2;255;162;26m_[39m[38;2;255;161;26m_[39m[38;2;255;161;25m_[39m[38;2;255;160;25m|[39m  [38;2;255;159;24m\\[39m[38;2;255;159;24m_[39m[38;2;255;158;23m_[39m[38;2;255;157;23m_[39m[38;2;255;157;22m/[39m[38;2;255;156;22m|[39m [38;2;255;155;21m.[39m[38;2;255;155;21m_[39m[38;2;255;154;20m_[39m[38;2;255;153;20m/[39m[38;2;255;153;19m([39m[38;2;255;152;19m_[39m[38;2;255;151;18m)[39m
                  [38;2;255;150;18m|[39m[38;2;255;150;17m_[39m[38;2;255;149;17m|[39m                         [38;2;255;148;16m|[39m[38;2;255;148;16m_[39m[38;2;255;147;15m|[39m      
  `;
  return figletMessage;
};

/**
 * Generate a random number between the negative of the provided argument and the positive
 * @param {number} maxLimit The maximum number for the generated one
 * @returns {number} Random number between the negative of the provided argument and the positive
 */
const getRandomOffset = (maxLimit) => {
  return Math.floor(Math.random() * maxLimit * 2) - maxLimit;
};

const run = async () => {
  /** Write the heading message with the app name */
  console.log(getFigletWelcomeMessage());

  /** Save settings so we don't do unnecessary operations */
  const interval = getIdleTimeInterval();
  const moveOffset = getMoveOffset();
  const isRandom = getIsRandom();

  process.stdout.cursorTo(4);
  process.stdout.write(
    `Offset:   ${
      isRandom ? colored.red("Random") : colored.yellow(moveOffset + "px")
    }`
  );
  process.stdout.cursorTo(40);
  process.stdout.write(`Ver: ${colored.yellow(version)}\n`);

  process.stdout.cursorTo(4);
  process.stdout.write(`Interval: ${colored.yellow(interval.seconds + "s")}`);
  process.stdout.cursorTo(40);
  process.stdout.write(`By:  ${colored.yellow("bmutafov")}\n`);

  process.stdout.cursorTo(4);
  process.stdout.write(
    "___________________________________________________\n\n"
  );

  /** Set the default idle time label and write it to console */
  process.stdout.cursorTo(4);
  const idleTimeString = "Idling for: ";
  process.stdout.write(idleTimeString);

  /** Hide the terminal cursor */
  process.stderr.write("\x1B[?25l");

  for (let i = 0, moveSign = +1; true; i++) {
    /** Display the info line and keep it updated every second */
    const displayIdleTime = secondsToDisplayTime(i);
    /** Move the cursor to where the default "Idle time" string ends */
    process.stdout.cursorTo(idleTimeString.length + 4);
    /** Clear everything after */
    process.stdout.clearLine(1);
    /** Write the remaining time */
    process.stdout.write(colored.yellow(displayIdleTime + "s"));
    process.stdout.cursorTo(40);
    /** Write the status value */
    process.stdout.write(colored.green("Active"));

    /** If we have reached the maximum idle time */
    if (i % interval.seconds === 0) {
      const nextMoveOffsetAbs = isRandom ? getRandomOffset(600) : moveOffset;
      const nextMoveOffset = nextMoveOffsetAbs * moveSign;
      moveSign *= -1;

      /** Get last position of the cursor and move it by the given offset */
      const prevPosition = await mouse.getPosition();
      const coordinates = new Point(
        prevPosition.x + nextMoveOffset,
        prevPosition.y + nextMoveOffset
      );

      await mouse.setPosition(coordinates);
    }

    /** Sleep 1 second */
    await sleep(1_000);
  }
};

run();
