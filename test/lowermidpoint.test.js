// file to test
const { lowerMidpoint } = require("../utils/general");

// testing libraries
const assert = require("assert");
const readline = require("readline");
const sinon = require("sinon");
const { expect } = require("chai");
require("chai").should();

const resetModules = () => delete require.cache[require.resolve("./guess")];

describe("Computer guessing number", () => {
  beforeEach(() => {
    // resetModules();
  });
  afterEach(() => {
    // sinon.restore();
  });

  it("can find simple lower-mid point once upper limit is covered", () => {
    assert.strictEqual(lowerMidpoint(4, 0, true), 2, "2 is mid (0,4)");
    assert.strictEqual(lowerMidpoint(3, 0, true), 1, "1 is lower-mid (0,3)");
    assert.strictEqual(lowerMidpoint(6, 3, true), 4, "4 is lower-mid (3,6)");
    assert.strictEqual(lowerMidpoint(7, 3, true), 5, "5 is mid (3,7)");
  });

  it("Returns upper limit when 'checkedUpperLimit' is false", () => {
    assert.strictEqual(
      lowerMidpoint(7, 6, false),
      7,
      "down to 6 and 7, start with upper bound"
    );
  });

  it("Returns rounded-down average when 'checkedUpperLimit' is true", () => {
    assert.strictEqual(
      lowerMidpoint(7, 6, true),
      6,
      "down to 6 and 7, having checked upper, now try lower."
    );
  });

  // function includes waiting for user input
  it("Can successfully prompt user with 'Higher or Lower?'");

  it.skip("Welcomes user and explains the game", async (done) => {
    let val = ""; // read print out on console - how?
    assert.strictEqual(
      val,
      "Please think of a number between 1 and 100 (inclusive)."
    );
    done();
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
    const actual = await guess();
    expect(actual).to.be.eql(77);
    sinon.assert.calledWithExactly(
      readlineInterfacestub.question,
      "Please think of a number between 1 and 100 (inclusive).",
      sinon.match.func
    );
    sinon.assert.calledOnce(readlineInterfacestub.close); // equiv to calling done() on promise?
  });
});
