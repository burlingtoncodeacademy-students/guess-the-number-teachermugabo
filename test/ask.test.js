// file to test
const { assert } = require("chai");
const { ask } = require("../utils/general");

// https://glebbahmutov.com/blog/unit-testing-cli-programs/
describe("ask", () => {
  // setup mock stdin
  let stdin;
  beforeEach(() => {
    stdin = require("mock-stdin").stdin();
  });

  it.skip("asks a question", async () => {
    // setup response
    let input = "guess";
    let expected = 77;

    // https://nodejs.dev/learn/understanding-process-nexttick
    process.nextTick(() => {
      stdin.send(input, "ascii");
      stdin.end();
    });

    // ask question
    let actual = await ask("test question");
    console.log("actual", actual);

    // run test here
    assert.strictEqual(actual, expected);
  });
});
