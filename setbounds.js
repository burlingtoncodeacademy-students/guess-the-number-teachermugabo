const ask = require("./ask");

/**
 * Name: userWantsToSetOwnBounds
 * =============================
 * Predicate function that answers the question
 * posed by the method name with a boolean result.
 *
 * @returns {Boolean} does user want to set own bounds?
 */
const userWantsToSetOwnBounds = async () => {
  let answer = (
    await ask(
      "Btw, do you Wanna set your own lower & upper bound?" +
        " 0 & 100 are just the defaults. (Y/N) >_"
    )
  )
    .trim()
    .toUpperCase();

  // ask until we get a valid response
  while (answer != "Y" && answer != "N") {
    console.log("Please use Y or N. Let's try again.");
    answer = (await ask("Wanna make things interesting with new bounds? (Y/N)"))
      .trim()
      .toUpperCase();
  }

  return answer === "Y" ? true : false;
};

/**
 * Name: getUserSetBounds
 * ======================
 * Prompt user for ceiling & floor.
 * Provide error handling -- if there are
 * problems, return defaults for values.
 *
 * @param {Number} defaultCeiling
 * @param {Number} defaultFloor
 * @returns [ceiling, floor]
 */
const getUserSetBounds = async (defaultCeiling, defaultFloor) => {
  // declare variables
  let ceiling, floor;

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
      [ceiling, floor] = [defaultCeiling, defaultFloor];
    }
  } catch (err) {
    console.log(err.message);
    console.log("This is hard. We're gonna stick with the defaults.");
  }

  return [ceiling, floor];
};

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
  // set defaults
  let ceiling = 100;
  let floor = 0;

  console.log(); // insert new line for layout

  // ask user if they want to set bounderies
  if (await userWantsToSetOwnBounds()) {
    // if they do, collect them - pass in defaults in case there are issues
    if (userWantsToSetOwnBounds)
      [ceiling, floor] = await getUserSetBounds(ceiling, floor);
  }

  console.log(); // another blank line for layout
  return [ceiling, floor];
};

module.exports = { allowUserToSetBounds };
