const { assert } = require("chai");
const { isValidUpperLowerBounds } = require("../setbounds.js");

describe("User setting upper & lower bounds", () => {
  // kill process after this suite
  // after(() => process.exit(0));

  it("checks whether user wants to set their own or accept defaults");

  it(
    "aks user for their upper & lower bounds, if they said yes to wanting to set their own"
  );

  it("checks that the user entered bounds the make sense", () => {
    assert.strictEqual(
      isValidUpperLowerBounds(100, 0),
      true,
      "100 and 0 are valid"
    );
    assert.strictEqual(
      isValidUpperLowerBounds(60, 70),
      false,
      "ceiling < floor is not valid"
    );
    assert.strictEqual(
      isValidUpperLowerBounds("100", "50"),
      true,
      '"100" and "50" are valid - convert them'
    );
    assert.strictEqual(
      isValidUpperLowerBounds("a", "b"),
      false,
      'letters "a" and "b" are not valid'
    );
  });

  it("returns user set bounderies, if they wanted to set their own");

  it("return defaults (0,100) if user wasn't interest");
});
