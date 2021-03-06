const { ask } = require("./general");

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
      "Would you like to set your own lower & upper bounds?\n" +
        "0 & 100 are the defaults.\n" +
        "(Y/N) >_"
    )
  )
    .trim()
    .toUpperCase();

  // ask until we get a valid response
  while (answer != "Y" && answer != "N") {
    console.log("Please use Y or N. Let's try again.");
    answer = (
      await ask("Spice things up by setting your own bounds?\n" + "(Y/N) >_")
    )
      .trim()
      .toUpperCase();
  }

  return answer === "Y" ? true : false;
};

/**
 * Name: isValidUpperLowerBounds
 * =============================
 * Checks to make sure user entered integers for the bounds
 * and that the upper > lower bound.
 *
 * @param {Number} ceiling
 * @param {Number} floor
 * @returns {Boolean} predicate evaluation
 */
const isValidUpperLowerBounds = (upper, lower) => {
  // first, type cast them to strings
  let ceiling = Number(upper),
    floor = Number(lower);

  // then return the check - are they integers and is ceiling > floor
  return (
    Number.isInteger(ceiling) && Number.isInteger(floor) && ceiling > floor
  );
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
    floor = Number(await ask("Floor (#) >_"));
    ceiling = Number(await ask("Ceiling (#) >_"));

    // sanitatize inputs -- make sure they're numbers & ceiling > floor
    if (isValidUpperLowerBounds(ceiling, floor)) {
      console.log("Excellent. Let's get it.");
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

  // ask user if they want to set bounderies
  if (await userWantsToSetOwnBounds()) {
    // if they do, collect them - pass in defaults in case there are issues
    if (userWantsToSetOwnBounds)
      [ceiling, floor] = await getUserSetBounds(ceiling, floor);
  }

  console.log(); // another blank line for layout
  return [ceiling, floor];
};

module.exports = { allowUserToSetBounds, isValidUpperLowerBounds };
