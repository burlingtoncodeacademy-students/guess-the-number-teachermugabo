const ask = require("./ask");
const _ = require("underscore");

const mid = (top, bottom) => Math.floor((top + bottom) / 2);

const exclamation = () =>
  _.sample([
    "Shucks!",
    "Damn!",
    "This is not as easy as it looks!",
    "Seriously considering giving up...uno mas!",
    "Holy Potatoes!",
  ]);

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
    console.log(`It only took me ${count} tries to guess it. ¯\_(ツ)_/¯`);
    console.log("bye");
    process.exit(0); // optionally, extend an option to play again.
  } else if (response === "N") {
    // nope - try again. get some clues first
    let direction = (
      await ask(`${exclamation()} (H)igher or (L)ower? >_`)
    ).toUpperCase();

    if (direction === "H" || direction === "L") {
      // if we were high, our attempt becomes our floor
      if (direction === "H") [ceiling, floor] = [ceiling, attempt];
      // if we were low, then our attempt becomes our ceiling
      else [ceiling, floor] = [attempt, floor];

      // our next attempt is integer midpoint of the new floor & ceiling
      attempt = mid(ceiling, floor);
    } else {
      // user entered neither H nor L -- clarify input options :-)
      console.log("Please use H or L. Let's try again.");
    }
  } else {
    // user entered neither Y nor N -- clarify input options :-)
    console.log("Please use either Y or N. Here we go again.");
  }

  // debugging line: here's our next attempt
  // console.log(
  //   `Now trying top: ${ceiling}, bottom: ${floor}, guess: ${mid(
  //     ceiling,
  //     floor
  //   )}`
  // );

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

  // make our initial guess
  let seed = 41; // prime number, right? In any case, our initial guess.

  // start the game!
  play(100, 0, seed, 0);
};

// setup & kick off the game
init();

module.exports = { init, play, mid };
