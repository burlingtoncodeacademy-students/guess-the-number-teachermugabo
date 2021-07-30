const readline = require("readline");

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

const ask = (prompt) =>
  new Promise((resolve, reject) => {
    readlineInterface.question(prompt, resolve);
  });

// testing code
// (async () => {
// This works!
// ===============
// let name = await ask("what is your name?\n>_");
// console.log("your name is", name);
// process.exit(0);
// ? attempt two -- doesn't allow me to enter my name -- why?
// ============
// ask("what is your name?\n>_")
//   .then(function (reply) {
//     console.log("user replied...", reply);
//   })
//   .finally(process.exit(0));
// })();

module.exports = ask;
