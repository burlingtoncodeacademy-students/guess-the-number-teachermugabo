const readline = require("readline");

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

module.exports = ask;
