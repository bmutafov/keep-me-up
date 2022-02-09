#!/usr/bin/env node
//@ts-check

const { mouse, Point } = require("@nut-tree/nut-js");

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
 * Moves the mouse cursor by X amount of pixels
 * @param {number} offset How many pixels should the mouse be moved by
 */
const mouseMover = async (offset) => {
  console.log(`\x1b[33m${now()}\x1b[0m Moving mouse cursor by ${offset} pixels`);

  const prevPosition = await mouse.getPosition();
  const coordinates = new Point(prevPosition.x + offset, prevPosition.y + offset);
  await mouse.setPosition(coordinates);

  setTimeout(() => {
    mouseMover(offset * -1);
  }, 30_000);
};

console.log("\x1b[32mStarting mouse mover script...\x1b[0m");
mouseMover(1);
