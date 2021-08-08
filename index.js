const ask = require("./ask");
const _ = require("underscore");
const { allowUserToSetBounds } = require("./setbounds");

// create randomly alternating middle to
// handle the upper & lower bound edges cases
// That will also help us address the "cheating catcher which doesn't work right now"
/**
 * @deprecated
 * alternativeMidpoint
 * ===================
 * Randomly returns the round up or rounded down
 * average. This was at times more efficient and other
 * time less efficient than our lowerMidpoint search.
 * It also led to painful edge cases. So it is no longer
 * being used.
 *
 * @param {*} top
 * @param {*} bottom
 * @returns - randomly alternating integer midpoint search.
 */
const alternatingMidpoint = (top, bottom) =>
  Math.random() > 0.5
    ? Math.ceil((top + bottom) / 2)
    : Math.floor((top + bottom) / 2);

// global state to track whether
// upper limit is checked.
let checkedUpperBound = false;

/**
 * lowerMidpoint
 * =============
 * Return average of ceiling and floor rounded down.
 * since rounding down never returns the ceiling of
 * a pair (2,3), (99,100) - in each of these two cases,
 * 2 and 99 would always be returned respectively.
 *
 * To address that, this method uses global state in the
 * variable checkedUpperBound to make sure it also
 * returns the upper bound 3 and 100, respectively in the
 * examples above).
 *
 * @param {Number} ceiling
 * @param {Number} floor
 * @returns lower integer midpoint (e.g. rounded down average)
 */
const lowerMidpoint = (ceiling, floor) => {
  console.log(`ceiling=${ceiling} and floor=${floor}`);
  // if we're down to the wire, and haven't checked up limit, do so.
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
 * name: endGame
 * =============
 * Helper method to end the game.
 * @param {String} msg - game-ending message
 * @param {Number} count - tries to guess number
 */
const endGame = (msg, count) => {
  console.log(msg);
  console.log();

  console.log(`It only took me ${count} tries to guess it. ¯\\_(ツ)_/¯`);
  console.log("bye");
  process.exit(0);
};

/**
 * Name: play
 * ==========
 * This function is the recursive main game loop.
 * Uses the params to narrow onto the secret number.
 *
 * @param {Number} ceiling - upper bound
 * @param {Number} floor - lower bound
 * @param {Number} attempt - next try
 * @param {Number} count - tracks number of tries
 */
const play = async (ceiling, floor, attempt, count) => {
  let response;

  // if ceiling and floor are equal, then we got the answre.
  if (ceiling === floor) {
    endGame(`Then it's gotta be ${ceiling}. Thanks for playitng.`, count);
  }

  // check whether our attempt is correct
  try {
    response = await ask(`Is it ${attempt}? (Y/N) >_`);
  } catch (err) {
    console.log(err.message);
  }

  // allow player to escape
  if (response === "leave") process.exit(0);

  // let's be friendly -- ensure response upper case for the user
  response = response.toUpperCase();

  // checking -- did we guess it right?
  // we got it!
  if (response === "Y") {
    // celebrate victor and then signed oout!
    endGame("Hip! Hip! Hurray!! Thanks for playing!", count);
  }
  // nope - try again.
  else if (response === "N") {
    // if human says no, and the answer is only one of two, then immediately return the other

    // if we have already checked the upper bound (b/c ceiling and floor are one appart),
    // then it must be the lower point
    if (checkedUpperBound) {
      endGame(`Then it must be ${floor}. Thanks for playing.`, count);
    }
    // else if we haven't checked the ceiling yet and
    // ceiling and floor are one apart, then it's gotta be the ceiling.
    else if (ceiling - floor === 1) {
      endGame(`Then it must be ${ceiling}. Thanks for playing.`, count);
    }

    //get some clues first
    let direction = (
      await ask(`${exclamation()} (H)igher or (L)ower? >_`)
    ).toUpperCase();

    // based on validation checks, we may choose to not update our attempt
    let updateAttempt = true;

    if (direction === "H" || direction === "L") {
      // if human said go higher
      if (direction === "H") {
        // if our guess was already the ceiling, end game.
        if (attempt === ceiling) {
          endGame(
            `Can't go any higher than ${ceiling}. Go get thee some coffe.`,
            count
          );
        }
        // if guess was just one away, then we know the solution
        else if (ceiling - attempt === 1) {
          endGame(`Then it must be ${ceiling}. Thanks for playing.`, count);
        }
        // if 'Higher' is a reasonable play, then attempt + 1 becomes our floor
        else {
          [ceiling, floor] = [ceiling, attempt + 1];
        }
      }
      // if human said go lower!
      else {
        // end game if user is telling us to go lower than the floor
        if (attempt === floor) {
          endGame(
            `Can't go lower than ${floor}. Have you had your coffee?`,
            count
          );
        }
        // if there's only one choice left, end game with it.
        if (attempt - floor === 1) {
          endGame(`Then it must be ${floor}. Thanks for playing.`, count);
        }
        // if human's number is lower, then our attempt becomes our ceiling
        else {
          [ceiling, floor] = [attempt - 1, floor];
        }
      }

      // our next attempt is a mid-point new floor & ceiling
      // the midpoint returns the ceiling of the average but also
      // has logic to ensure the ceiling is also returned when appropriate.
      if (updateAttempt) attempt = lowerMidpoint(ceiling, floor);
    } else {
      // user entered neither H nor L -- clarify input options :-)
      console.log("Please use H or L. Let's try again.");
    }
  } else {
    // user entered neither Y nor N -- clarify input options :-)
    console.log("Please use either Y or N. Here we go again.");
  }

  // try again with new bounderies and our next guess
  play(ceiling, floor, attempt, count + 1);
};

/**
 * init
 * ====
 * Introduces and launches the game.
 */
const init = async () => {
  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );

  await ask(
    "Please think of a number between 1 and 100 (inclusive).\n" +
      "I will try to guess it. Ready? Press [Enter] to start."
  );

  let [ceiling, floor] = await allowUserToSetBounds();

  // seed our guess with a random number in range
  let seed = _.random(floor, ceiling);

  // start the game!
  play(ceiling, floor, seed, 1);
};

// setup & kick off the game
init();

module.exports = { init, play, lowerMidpoint, alternatingMidpoint };
