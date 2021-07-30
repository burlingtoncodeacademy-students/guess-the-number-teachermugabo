// file to test
const start = require("../guess");

// testing libraries
const assert = require("assert");
const readline = require("readline");
const sinon = require("sinon");
const { expect } = require("chai");
require("chai").should();

const resetModules = () => delete require.cache[require.resolve("./guess")];

describe("number guessing game", () => {
  beforeEach(() => {
    resetModules();
  });
  afterEach(() => {
    sinon.restore();
  });

  it.skip("Welcomes user and explains the game", async () => {
    let val = ""; // read print out on console - how?

    assert.strictEqual(
      val,
      "Please think of a number between 1 and 100 (inclusive)."
    );
  });

  // * https://glebbahmutov.com/blog/unit-testing-cli-programs/
  // https://stackoverflow.com/questions/65298539/how-to-test-function-that-requires-user-input-in-command-line-using-mocha-chai
  it.skip("Prompt user for guess", async () => {
    // test that user enters a guess -- how?!

    // need a stup - use sinon js

    const readlineInterfacestub = {
      question: sinon.stub().callsFake((query, callback) => {
        callback(77); // guess number
      }),
      close: sinon.stub(),
    };

    sinon.stub(readline, "createInterface").returns(readlineInterfacestub);
    const actual = await start();
    expect(actual).to.be.eql(77);

    sinon.assert.calledWithExactly(
      readlineInterfacestub.question,
      "Please think of a number between 1 and 100 (inclusive).",
      sinon.match.func
    );
    sinon.assert.calledOnce(readlineInterfacestub.close); // equiv to calling done() on promise?
  });
});
