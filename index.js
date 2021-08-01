const ask = require("./ask");
const _ = require("underscore");
const { allowUserToSetBounds } = require("./setbounds");

// create randomly alternating middle to
// handle the upper & lower bound edges cases
// TODO revert to simple lowermid point & implement
// TODO (cont.) logic to ensure the upper ceiling is addressed
// That will also help us address the "cheating catcher which doesn't work right now"
const alternatingMidpoint = (top, bottom) =>
  Math.random() > 0.5
    ? Math.ceil((top + bottom) / 2)
    : Math.floor((top + bottom) / 2);

// keep game interesting with different frustrations
const exclamation = () =>
  _.sample([
    "Shucks!",
    "Damn!",
    "This is not as easy as it looks!",
    "Seriously considering giving up...uno mas!",
    "Holy Potatoes!",
  ]);

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

  // check whether we got it right
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
    console.log("Hip! Hip! Hurray!! Thanks for playing!");
    // ascii art courset of urban dictionary
    console.log(`It only took me ${count} tries to guess it. ¯\\_(ツ)_/¯`);
    console.log("bye");
    process.exit(0); // optionally, extend an option to play again.
  }
  // nope - try again.
  else if (response === "N") {
    // cheat detector: if there is only a difference of 1 b/t ceiling and floor - the gig is up!
    if (ceiling - floor === 1) {
      console.log(
        `Your number has to be either ${ceiling} or ${floor}.` // or you are cheating!`
      );
      console.log("bye");
      process.exit(0);
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
        // make sure they're not saying 'higher' than the ceiling!
        if (attempt >= ceiling) {
          console.log(
            `We've already established your number is lower than ${ceiling}! What games are you playing? Try again...`
          );
          updateAttempt = false;
        }
        // if human's number is higher, our attempt becomes our floor
        else {
          [ceiling, floor] = [ceiling, attempt];
        }
      }
      // if human said go lower!
      else {
        // make sure the human's not telling us to go lower than the bound!
        if (attempt <= floor) {
          console.log(
            `We've already established that your number is higher than ${floor}. Have you had your coffee?`
          );
          updateAttempt = false;
        }
        // if human's number is lower, then our attempt becomes our ceiling
        else {
          [ceiling, floor] = [attempt, floor];
        }
      }

      // our next attempt is an alternating midpoint of the new floor & ceiling
      if (updateAttempt) attempt = alternatingMidpoint(ceiling, floor);
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

module.exports = { init, play, alternatingMidpoint };
