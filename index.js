const ask = require("./ask");
const reverse_game = require("./reverse_game");
const _ = require("underscore");
const { allowUserToSetBounds } = require("./setbounds");
const { indexOf } = require("underscore");

// global variable used by recurcive game loop to end game
let gameOver = false;

// create randomly alternating middle to
// handle the upper & lower bound edges cases
// That will also help us address the "cheating catcher which doesn't work right now"
/**
 * @deprecated - no longer being used / using lowerMidpoint instead.
 * alternatingMidpoint
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
 * a pair (2,3), (99,100) -- in each of these two cases,
 * 2 and 99 would always be returned respectively -- this
 * method uses global state in the variable checkedUpperBound
 * to make sure it also returns the upper bound 3 and 100,
 * respectively in the
 * examples above.
 *
 * @param {Number} ceiling
 * @param {Number} floor
 * @returns lower integer midpoint (e.g. rounded down average)
 */
const lowerMidpoint = (ceiling, floor) => {
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
 * name: endGame
 * =============
 * Helper method to end the game.
 * @param {String} msg - game-ending message
 * @param {Number} count - tries to guess number
 */
const endGame = (msg, count) => {
  console.log(msg);
  console.log();

  if (count <= 1) console.log(`Too easy! Took only one try to figure it out!`);
  else console.log(`Took me ${count} tries to resolve this. ¯\\_(ツ)_/¯`);

  // gameOver = true;
  process.exit(0);
};

/**
 * Name: play
 * ==========
 * This function is the recursive main game loop.
 * Uses the params to converge onto the secret number.
 *
 * @param {Number} ceiling - upper bound
 * @param {Number} floor - lower bound
 * @param {Number} attempt - next try
 * @param {Number} count - tracks number of tries
 */
const play = async (ceiling, floor, attempt, count) => {
  let response;

  // check whether our attempt is correct
  try {
    response = (await ask(`Is it ${attempt}? (Y/N/q) >_`)).toUpperCase();
  } catch (err) {
    console.log(err.message);
  }

  // allow player to escape
  if (response && response[0] === "Q") {
    console.log("Sorry to see you leave...till next time!");
    process.exit(0);
  }

  // checking -- did we guess it right?
  // we got it!
  if (response === "Y") {
    // celebrate victor and then signed oout!
    endGame("Hip! Hip! Hurray!! Thanks for playing!", count);
  }
  // nope - try again.
  else if (response === "N") {
    // if human says no, and the ceiling already equals the floor,
    // if ceiling and floor are equal, then we know the answer but
    // let's let the user try and tell us which direction to go...
    if (ceiling === floor) console.log("🤔");

    // prompt the user with which way to go
    // TODO ensure that H or L is returned
    let direction = await promptUserHigherOrLower(
      "(H)igher or (L)ower? >_",
      "Please user either H or L. Here we go again."
    );

    // if human said go higher
    if (direction === "H") {
      // cheat catch -- if our guess was already the ceiling, end game.
      if (attempt === ceiling) {
        endGame(
          `You've already said your number was lower than ${ceiling}. ` +
            `Go get thee some coffee.`,
          count
        );
      }

      // if 'Higher' is a reasonable play, then attempt + 1 becomes our floor
      else {
        [ceiling, floor] = [ceiling, attempt + 1];
      }
    }
    // if human said go lower!
    else if (direction === "L") {
      // cheat catch #2 -- user is telling us to go lower than the floor
      if (attempt === floor) {
        console.log("🤔");
        endGame(
          `You've already set the floor to be ${floor}. ` +
            `Have you had your coffee?`,
          count
        );
      }

      // if human's number is lower, then our attempt becomes our ceiling
      else {
        [ceiling, floor] = [attempt - 1, floor];
      }
    }

    // our next attempt is a mid-point new floor & ceiling
    // the midpoint returns the ceiling of the average but also
    // has logic to ensure the ceiling is also returned when appropriate.
    attempt = lowerMidpoint(ceiling, floor);
  } else {
    // user entered neither Y nor N -- clarify input options :-)
    console.log("Please use either Y or N. Here we go again.");
  }

  // if game over, simply return
  if (gameOver) return;
  else {
    // continue with new bounderies and our next guess
    await play(ceiling, floor, attempt, count + 1);
  }
};

/**
 * higherOr
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

/**
 * Name: game
 *
 * Encapsulates the starting of the default game,
 * from the reverse_game. The default game is where
 * the Human chooses a number, and the computer
 * tries to guess it.
 */
const game = async () => {
  console.log(); // empty line for layout
  console.log(
    "Let's play a game where you (human) choose " +
      "a number and I (computer) try to guess it."
  );

  let [ceiling, floor] = await allowUserToSetBounds();

  // seed our guess with a random number in range
  let seed = _.random(floor, ceiling);

  // start the game!
  await play(ceiling, floor, seed, 1);
};

const GAME_MENU = `There are two kinds of games in the world:
  1. Where you choose a number and I (the computer) guess it
  2. Where I choose a number and you (human) try to guess.

  Which will it be? (q to quit)`;

/**
 * init
 * ====
 * Introduces and launches the game.
 */
const init = async () => {
  console.log(GAME_MENU);

  // collect user input (& clean it up)
  let choice = (await ask(`>_`)).trim().toLowerCase();

  while (choice != "q") {
    debugger;
    console.log();
    console.log("inside whole game loop - and choice =", choice);

    // validate user choice
    let options = ["1", "2", "q"];
    while (!choice || options.indexOf(choice) === -1) {
      console.log("Please enter either 1,2 or q. Try again.");
      choice = (await ask(` >_`)).toLowerCase();
    }

    // menu switch
    if (choice === "1") {
      // start the default game - you choose a number
      await game();
    } else if (choice === "2") {
      // start the reverse - computer chooses a number
      await reverse_game();
    } else {
      // choice = 'q'
      console.log("Sorry to see you go. 'till next time! ");
      process.exit(0);
    }

    // empty line for layout
    console.log();

    // prompt user to play again
    console.log("Would you like to play again? Here was the menu:");
    console.log(GAME_MENU);
    choice = (await ask(`>_`)).trim().toLowerCase();
  }
};

// setup & kick off the game
init();

module.exports = {
  init,
  play,
  lowerMidpoint,
  promptUserHigherOrLower,
  alternatingMidpoint,
};
