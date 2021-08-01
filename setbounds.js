const ask = require("./ask");

/**
 * Name: allowUserToSetBounds
 * ==========================
 * Guides users through setting the
 * ceiling and floor of the guessing game.
 * Returns an array with both.
 *
 * @returns [ceiling, floor]
 */
const allowUserToSetBounds = async () => {
  let ceiling = 100;
  let floor = 0;

  console.log(); // insert new line for layout
  let answer = (
    await ask(
      "Btw, do you Wanna set your own lower & upper bound?" +
        " 0 & 100 are just the defaults. (Y/N) >_"
    )
  )
    .trim()
    .toUpperCase();

  // look until we get a valid response
  while (answer != "Y" && answer != "N") {
    console.log("Please use Y or N. Let's try again.");
    answer = (await ask("Wanna make things interesting with new bounds? (Y/N)"))
      .trim()
      .toUpperCase();
  }

  // if yes, then collect bounds and update the ceiling & floor variables
  if (answer === "Y") {
    try {
      ceiling = Number(await ask("Ceiling (#) >_"));
      floor = Number(await ask("Floor (#) >_"));

      // sanitatize inputs -- make sure they're numbers & ceiling > floor
      if (
        Number.isInteger(ceiling) &&
        Number.isInteger(floor) &&
        ceiling > floor
      ) {
        console.log("Excellent. Moving on.");
      } else {
        console.log("I see we're being naughty. Let's stick with 0 and 100.");
        [ceiling, floor] = [100, 0];
      }
    } catch (err) {
      console.log(err.message);
      console.log("This is hard. We're gonna stick with the defaults.");
    }
  }

  console.log(); // another blank line for layout
  return [ceiling, floor];
};

module.exports = { allowUserToSetBounds };
