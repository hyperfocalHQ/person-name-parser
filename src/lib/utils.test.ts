import { describe, it, expect } from "vitest";
import { stripNicknames } from "./utils";

describe("stripNicknames", () => {
  it("should remove single-quoted nicknames", () => {
    expect(stripNicknames("William 'Bill' Gates")).toBe("William Gates");
  });

  it("should remove double-quoted nicknames", () => {
    expect(stripNicknames('John "Johnny" Doe')).toBe("John Doe");
  });

  it("should remove parenthesized nicknames", () => {
    expect(stripNicknames("John (Johnny) Doe")).toBe("John Doe");
  });

  it("should handle multiple nicknames", () => {
    expect(stripNicknames("William 'Bill' (Billy) Gates")).toBe(
      "William Gates"
    );
  });

  it("should handle names without nicknames", () => {
    expect(stripNicknames("John Doe")).toBe("John Doe");
  });

  it("should trim extra whitespace", () => {
    expect(stripNicknames("William   'Bill'   Gates")).toBe("William Gates");
  });

  it("should handle empty strings", () => {
    expect(stripNicknames("")).toBe("");
  });

  it("should handle names with only nicknames", () => {
    expect(stripNicknames("'Bill'")).toBe("");
  });

  it("should handle complex combinations", () => {
    expect(stripNicknames("Robert 'Bob' (Bobby) \"Rob\" Smith")).toBe(
      "Robert Smith"
    );
  });

  it("should preserve other punctuation", () => {
    expect(stripNicknames("Mary-Jane 'MJ' Parker")).toBe("Mary-Jane Parker");
  });
});
