const _ = require("underscore");

const { ask } = require("./utils/general");
const reverse_game = require("./reverse_game");
const game = require("./game");

const GAME_MENU = `There are two kinds of games in the world:
  1. Where you choose a number and I (the computer) guess it
  2. Where I choose a number and you (human) try to guess.

  Which will it be? (q to quit)`;

/**
 * init
 * ====
 * Introduces and launches the game.
 */
const start = async () => {
  console.log(GAME_MENU);

  // collect user input (& clean it up)
  let choice = (await ask(`>_`)).trim().toLowerCase();

  while (choice != "q") {
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

  // end game
  console.log("Thanks for playing!");
  process.exit(0);
};

// let the games begin
start();
