import { describe, test, expect } from "vitest";
import { parseName } from "./parser";

describe("Name Parser", () => {
  describe("Basic names", () => {
    test("parses simple first and last name", () => {
      const result = parseName("John Smith");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Smith",
        confidence: 1.0,
      });
    });

    test("parses first, middle, and last name", () => {
      const result = parseName("John David Smith");
      expect(result).toEqual({
        firstName: "John",
        middleName: "David",
        lastName: "Smith",
        confidence: 1.0,
      });
    });

    test("parses single name as first name", () => {
      const result = parseName("Madonna");
      expect(result).toEqual({
        firstName: "Madonna",
        confidence: 0.5,
      });
    });
  });

  describe("Prefixes", () => {
    test("parses name with Mr prefix", () => {
      const result = parseName("Mr John Smith");
      expect(result).toEqual({
        prefix: "Mr",
        firstName: "John",
        lastName: "Smith",
        confidence: 1.0,
      });
    });

    test("parses name with Dr. prefix (with period)", () => {
      const result = parseName("Dr. Sarah Johnson");
      expect(result).toEqual({
        prefix: "Dr.",
        firstName: "Sarah",
        lastName: "Johnson",
        confidence: 1.0,
      });
    });

    test("parses name with Professor prefix", () => {
      const result = parseName("Professor Albert Einstein");
      expect(result).toEqual({
        prefix: "Professor",
        firstName: "Albert",
        lastName: "Einstein",
        confidence: 1.0,
      });
    });
  });

  describe("Suffixes", () => {
    test("parses name with Jr suffix", () => {
      const result = parseName("Martin Luther King Jr");
      expect(result).toEqual({
        firstName: "Martin",
        middleName: "Luther",
        lastName: "King",
        suffix: "Jr",
        confidence: 1.0,
      });
    });

    test("parses name with PhD suffix", () => {
      const result = parseName("Jane Doe PhD");
      expect(result).toEqual({
        firstName: "Jane",
        lastName: "Doe",
        suffix: "PhD",
        confidence: 1.0,
      });
    });

    test("parses name with roman numeral suffix", () => {
      const result = parseName("William Gates III");
      expect(result).toEqual({
        firstName: "William",
        lastName: "Gates",
        suffix: "III",
        confidence: 1.0,
      });
    });
  });

  describe("Particles and compound names", () => {
    test("parses Dutch name with van particle", () => {
      const result = parseName("Ludwig van Beethoven");
      expect(result).toEqual({
        firstName: "Ludwig",
        lastName: "van Beethoven",
        confidence: 1.0,
      });
    });

    test("parses name with von particle", () => {
      const result = parseName("Alexander von Humboldt");
      expect(result).toEqual({
        firstName: "Alexander",
        lastName: "von Humboldt",
        confidence: 1.0,
      });
    });

    test("parses Italian name with da particle", () => {
      const result = parseName("Leonardo da Vinci");
      expect(result).toEqual({
        firstName: "Leonardo",
        lastName: "da Vinci",
        confidence: 1.0,
      });
    });

    test("parses name with de particle", () => {
      const result = parseName("Charles de Gaulle");
      expect(result).toEqual({
        firstName: "Charles",
        lastName: "de Gaulle",
        confidence: 1.0,
      });
    });

    test("parses name with middle name and particle", () => {
      const result = parseName("Vincent Willem van Gogh");
      expect(result).toEqual({
        firstName: "Vincent",
        middleName: "Willem",
        lastName: "van Gogh",
        confidence: 1.0,
      });
    });
  });

  describe("Nicknames", () => {
    test("strips nickname in single quotes", () => {
      const result = parseName("William 'Bill' Gates");
      expect(result).toEqual({
        firstName: "William",
        lastName: "Gates",
        confidence: 1.0,
      });
    });

    test("strips nickname in double quotes", () => {
      const result = parseName('Robert "Bob" Smith');
      expect(result).toEqual({
        firstName: "Robert",
        lastName: "Smith",
        confidence: 1.0,
      });
    });

    test("strips nickname in parentheses", () => {
      const result = parseName("John (Johnny) Doe");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        confidence: 1.0,
      });
    });
  });

  describe("Initials", () => {
    test("treats initials as first name", () => {
      const result = parseName("A.B. Cooper");
      expect(result).toEqual({
        firstName: "A.B.",
        lastName: "Cooper",
        confidence: 1.0,
      });
    });

    test("parses name with middle initial", () => {
      const result = parseName("John F. Kennedy");
      expect(result).toEqual({
        firstName: "John",
        middleName: "F.",
        lastName: "Kennedy",
        confidence: 1.0,
      });
    });

    test("parses T. S. Eliot", () => {
      const result = parseName("T. S. Eliot");
      expect(result).toEqual({
        firstName: "T. S.",
        lastName: "Eliot",
        confidence: 1.0,
      });
    });
  });

  describe("Complex combinations", () => {
    test("parses name with prefix, middle, and suffix", () => {
      const result = parseName("Dr. Martin Luther King Jr");
      expect(result).toEqual({
        prefix: "Dr.",
        firstName: "Martin",
        middleName: "Luther",
        lastName: "King",
        suffix: "Jr",
        confidence: 1.0,
      });
    });

    test("parses name with prefix, particle, and suffix", () => {
      const result = parseName("Prof. Johann von Neumann PhD");
      expect(result).toEqual({
        prefix: "Prof.",
        firstName: "Johann",
        lastName: "von Neumann",
        suffix: "PhD",
        confidence: 1.0,
      });
    });
  });

  describe("Casing preservation", () => {
    test("preserves all caps", () => {
      const result = parseName("JOHN SMITH");
      expect(result).toEqual({
        firstName: "JOHN",
        lastName: "SMITH",
        confidence: 1.0,
      });
    });

    test("preserves lowercase", () => {
      const result = parseName("john smith");
      expect(result).toEqual({
        firstName: "john",
        lastName: "smith",
        confidence: 1.0,
      });
    });

    test("preserves mixed case", () => {
      const result = parseName("JoHn SmItH");
      expect(result).toEqual({
        firstName: "JoHn",
        lastName: "SmItH",
        confidence: 1.0,
      });
    });
  });

  describe("Edge cases", () => {
    test("handles empty string", () => {
      const result = parseName("");
      expect(result).toEqual({ confidence: 0 });
    });

    test("handles null", () => {
      const result = parseName(null);
      expect(result).toEqual({ confidence: 0 });
    });

    test("handles undefined", () => {
      const result = parseName(undefined);
      expect(result).toEqual({ confidence: 0 });
    });

    test("handles whitespace only", () => {
      const result = parseName("   ");
      expect(result).toEqual({ confidence: 0 });
    });

    test("handles extra whitespace", () => {
      const result = parseName("  John    Smith  ");
      expect(result).toEqual({
        firstName: "John",
        lastName: "Smith",
        confidence: 1.0,
      });
    });

    test("handles multiple middle names", () => {
      const result = parseName("John Paul George Ringo Starr");
      expect(result).toEqual({
        firstName: "John",
        middleName: "Paul George Ringo",
        lastName: "Starr",
        confidence: 1.0,
      });
    });
  });
});
