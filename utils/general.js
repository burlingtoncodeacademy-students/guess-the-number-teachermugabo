const _ = require("underscore");
const readline = require("readline");

// references to I/O interaces
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

/**
 * Name: ask
 *
 * Helper method to prompt user input.
 *
 * @param {String} prompt for the question
 * @returns
 */
const ask = (prompt) =>
  new Promise((resolve, reject) => {
    readlineInterface.question(prompt, resolve);
  });

/**
 * lowerMidpoint
 * =============
 * Return average of ceiling and floor rounded down.
 * since rounding down never returns the ceiling of
 * a pair (2,3), (99,100) -- in each of these two cases,
 * 2 and 99 would always be returned respectively -- this
 * method uses checkedUpperBound to make sure it also
 * returns the upper bound 3 and 100, respectively in the
 * examples above.
 *
 * @param {Number} ceiling - upper bound
 * @param {Number} floor - lower bound
 * @param {Boolean} checkedUpperBound -  covers upper bound
 * @returns lower integer midpoint (e.g. rounded down average)
 */
const lowerMidpoint = (ceiling, floor, checkedUpperBound) => {
  // console.log(`ceiling=${ceiling} and floor=${floor}`);

  // if we're down to the wire, and haven't checked upper limit, do so.
  if (ceiling - floor <= 1 && checkedUpperBound === false) {
    checkedUpperBound = true;
    return ceiling;
  }
  // else, keep returning lower mid point
  return Math.floor((ceiling + floor) / 2);
};

// keep game interesting with different frustrations
const exclamation = () =>
  _.sample([
    "Shucks!",
    "Damn!",
    "This is not as easy as it looks!",
    "Holy Potatoes!",
  ]);

/**
 * promptUserHigherOrLower
 * =======================
 * Convenience method to prompt user of guess direction
 *
 * @returns {String} direction - 'H' or 'L'
 */
const promptUserHigherOrLower = async (prompt, instructions) => {
  let direction = (await ask(`${exclamation()} ${prompt}`)).toUpperCase();

  while (direction != "H" && direction != "L") {
    console.log(instructions);
    direction = (await ask(prompt)).toUpperCase();
  }

  return direction;
};

module.exports = {
  ask,
  _,
  lowerMidpoint,
  exclamation,
  lowerMidpoint,
  promptUserHigherOrLower,
};
