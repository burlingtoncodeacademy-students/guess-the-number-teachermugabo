const rl = require("readline");
const readline = rl.createInterface(process.stdin, process.stdout);

const ask = (questionText) =>
  new Promise((resolve, reject) => readline.question(questionText, resolve));

module.exports = ask;
