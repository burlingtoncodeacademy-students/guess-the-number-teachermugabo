const { allowUserToSetBounds } = require("./utils/setbounds");
const {
  ask,
  _,
  lowerMidpoint,
  promptUserHigherOrLower,
  exclamation,
} = require("./utils/general");

// declare gameOver variable for global access
let gameOver;

// declare global state to track whether upper limit is checked.
let checkedUpperBound;

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

  if (count <= 1)
    console.log(`Too easy! Took me only one try to resolve this!`);
  else console.log(`Took me ${count} tries to resolve this. ¯\\_(ツ)_/¯`);

  // close out game
  gameOver = true;
  // process.exit(0);
};

/**
 * Name: game
 *
 * Encapsulates the starting of the default game,
 * from the reverse_game. The default game is where
 * the Human chooses a number, and the computer
 * tries to guess it.
 */
const init = async () => {
  console.log(); // empty line for layout
  console.log(
    "Let's play a game where you (human) choose " +
      "a number and I (computer) try to guess it."
  );

  let [ceiling, floor] = await allowUserToSetBounds();

  // seed our guess with a random number in range
  let seed = _.random(floor, ceiling);

  // init game state before new game
  gameOver = false;
  checkedUpperBound = false;

  // start the game!
  await play(ceiling, floor, seed, 1);
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
  // recursive end case - utilizing global state
  if (gameOver) return;

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
    attempt = lowerMidpoint(ceiling, floor, checkedUpperBound);
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

module.exports = init;
