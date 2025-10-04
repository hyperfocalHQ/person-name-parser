import { describe, it, expect } from "vitest";
import { isInitial, groupInitials } from "./initials";

describe("isInitial", () => {
  it("should return true for single letter", () => {
    expect(isInitial("J")).toBe(true);
    expect(isInitial("A")).toBe(true);
    expect(isInitial("Z")).toBe(true);
  });

  it("should return true for single letter with period", () => {
    expect(isInitial("J.")).toBe(true);
    expect(isInitial("A.")).toBe(true);
    expect(isInitial("Z.")).toBe(true);
  });

  it("should return true for lowercase letters", () => {
    expect(isInitial("j")).toBe(true);
    expect(isInitial("j.")).toBe(true);
  });

  it("should return false for multiple letters", () => {
    expect(isInitial("Jr")).toBe(false);
    expect(isInitial("John")).toBe(false);
    expect(isInitial("AB")).toBe(false);
  });

  it("should return false for non-letter characters", () => {
    expect(isInitial("1")).toBe(false);
    expect(isInitial("@")).toBe(false);
    expect(isInitial(".")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isInitial("")).toBe(false);
  });
});

describe("groupInitials", () => {
  it("should group consecutive initials together", () => {
    expect(groupInitials(["J.", "R.", "R.", "Tolkien"])).toEqual([
      "J. R. R.",
      "Tolkien",
    ]);
  });

  it("should handle single initial followed by name", () => {
    expect(groupInitials(["J.", "Smith"])).toEqual(["J.", "Smith"]);
  });

  it("should handle multiple initial groups", () => {
    expect(groupInitials(["J.", "R.", "Smith", "A.", "B.", "Johnson"])).toEqual(
      ["J. R.", "Smith", "A. B.", "Johnson"]
    );
  });

  it("should handle initials without periods", () => {
    expect(groupInitials(["J", "R", "R", "Tolkien"])).toEqual([
      "J R R",
      "Tolkien",
    ]);
  });

  it("should handle mixed initials with and without periods", () => {
    expect(groupInitials(["J.", "R", "Tolkien"])).toEqual([
      "J. R",
      "Tolkien",
    ]);
  });

  it("should handle array with no initials", () => {
    expect(groupInitials(["John", "Smith"])).toEqual(["John", "Smith"]);
  });

  it("should handle array with only initials", () => {
    expect(groupInitials(["J.", "R.", "R."])).toEqual(["J. R. R."]);
  });

  it("should handle empty array", () => {
    expect(groupInitials([])).toEqual([]);
  });

  it("should handle single token array", () => {
    expect(groupInitials(["John"])).toEqual(["John"]);
    expect(groupInitials(["J."])).toEqual(["J."]);
  });

  it("should handle initials at the end", () => {
    expect(groupInitials(["Smith", "J.", "R."])).toEqual(["Smith", "J. R."]);
  });

  it("should handle lowercase initials", () => {
    expect(groupInitials(["j.", "r.", "tolkien"])).toEqual([
      "j. r.",
      "tolkien",
    ]);
  });
});
