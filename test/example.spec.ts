import { assert, describe, it } from "vitest";

describe.skip("skipped suite", () => {
  it("test", () => {
    // Suite skipped, no error
    assert.equal(Math.sqrt(4), 3);
  });
});

describe("suite", () => {
  it("skipped test", () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3);
  });
});

// Only this suite (and others marked with only) are run
describe.only("suite", () => {
  it("test", () => {
    assert.equal(Math.sqrt(4), 3);
  });
});

describe("another suite", () => {
  it("skipped test", () => {
    // Test skipped, as tests are running in Only mode
    assert.equal(Math.sqrt(4), 3);
  });

  it.only("test", () => {
    // Only this test (and others marked with only) are run
    assert.equal(Math.sqrt(4), 2);
  });
});
