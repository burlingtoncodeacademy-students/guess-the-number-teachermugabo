// file to test
const { alternatingMidpoint } = require("../index");

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

  it("Can find an integer simple mid point", () => {
    assert.strictEqual(alternatingMidpoint(0, 4), 2, "2 is mid (0,4)");
    assert.strictEqual(alternatingMidpoint(0, 2), 1, "1 is mid (0,2)");
    assert.strictEqual(alternatingMidpoint(4, 6), 5, "5 is mid (4,5)");
  });

  it("Can find an integer 'alternating' mid point", () => {
    expect(alternatingMidpoint(0, 3), "alternate b/t 1 and 2").to.be.within(
      1,
      2
    );
    expect(alternatingMidpoint(1, 4), "alternate b/t 2 and 3").to.be.within(
      2,
      3
    );
    expect(alternatingMidpoint(4, 7), "alternate b/t 5 and 6").to.be.within(
      5,
      6
    );
  });

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
