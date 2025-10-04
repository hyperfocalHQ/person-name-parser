import { describe, test, expect } from "vitest";
import { calculateConfidence } from "./confidence";
import type { ParsedName } from "../types";

describe("calculateConfidence", () => {
  describe("Complete names", () => {
    test("returns 1.0 for name with both first and last", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0);
    });

    test("increases confidence with comma format", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0); // Capped at 1.0, but would be 1.1 without cap
    });

    test("increases confidence with prefix", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "John",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: true,
        hasSuffix: false,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0); // Capped at 1.0, but would be 1.05 without cap
    });

    test("increases confidence with suffix", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        lastName: "Smith",
        suffix: "Jr",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: true,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0); // Capped at 1.0, but would be 1.05 without cap
    });

    test("combines all positive factors (capped at 1.0)", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "John",
        lastName: "Smith",
        suffix: "PhD",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: true,
        hasSuffix: true,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0); // Would be 1.2 without cap
    });
  });

  describe("Incomplete names", () => {
    test("reduces confidence when missing first name", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.5); // 1.0 - 0.3 (missing first) - 0.2 (single token)
    });

    test("reduces confidence when missing last name", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.5); // 1.0 - 0.3 (missing last) - 0.2 (single token)
    });

    test("returns very low confidence when missing both first and last", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Mr",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: true,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.1); // Early return for missing both
    });

    test("returns very low confidence for completely empty name", () => {
      const parsed: Omit<ParsedName, "confidence"> = {};
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 0,
      });
      expect(confidence).toBe(0.1); // Early return for missing both
    });
  });

  describe("Token count impact", () => {
    test("reduces confidence for single token names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "Madonna",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.5); // 1.0 - 0.3 (missing last) - 0.2 (single token)
    });

    test("normal confidence for 2-token names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0);
    });

    test("normal confidence for 3-token names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        middleName: "David",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 3,
      });
      expect(confidence).toBe(1.0);
    });

    test("normal confidence for 5-token names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "John",
        middleName: "David",
        lastName: "Smith",
        suffix: "Jr",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: true,
        hasSuffix: true,
        tokenCount: 5,
      });
      expect(confidence).toBe(1.0);
    });

    test("reduces confidence for very long names (>5 tokens)", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        middleName: "Paul George Ringo",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 6,
      });
      expect(confidence).toBe(0.9); // 1.0 - 0.1 (>5 tokens)
    });

    test("reduces confidence for extremely long names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        middleName: "Paul George Ringo Pete Keith",
        lastName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 8,
      });
      expect(confidence).toBe(0.9); // 1.0 - 0.1 (>5 tokens)
    });
  });

  describe("Combined scenarios", () => {
    test("single token with prefix increases confidence", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "House",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: true,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.55); // 1.0 - 0.3 (missing last) - 0.2 (single token) + 0.05 (prefix)
    });

    test("comma format compensates for missing component", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "Smith",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.6); // 1.0 - 0.3 (missing last) - 0.2 (single token) + 0.1 (comma)
    });

    test("long name with all indicators", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Prof.",
        firstName: "John",
        middleName: "David Robert Michael",
        lastName: "Smith",
        suffix: "PhD",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: true,
        hasSuffix: true,
        tokenCount: 7,
      });
      expect(confidence).toBe(0.9); // 1.0 + 0.1 + 0.05 + 0.05 - 0.1 (>5 tokens), capped at 1.0 then reduced
    });
  });

  describe("Boundary values", () => {
    test("never returns value below 0", () => {
      const parsed: Omit<ParsedName, "confidence"> = {};
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 10,
      });
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBe(0.1); // Early return for missing both
    });

    test("never returns value above 1.0", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "John",
        middleName: "David",
        lastName: "Smith",
        suffix: "PhD",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: true,
        hasSuffix: true,
        tokenCount: 3,
      });
      expect(confidence).toBeLessThanOrEqual(1.0);
      expect(confidence).toBe(1.0);
    });

    test("zero tokens with missing names", () => {
      const parsed: Omit<ParsedName, "confidence"> = {};
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 0,
      });
      expect(confidence).toBe(0.1);
    });
  });

  describe("Real-world examples", () => {
    test("typical full name", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "Martin",
        middleName: "Luther",
        lastName: "King",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 3,
      });
      expect(confidence).toBe(1.0);
    });

    test("formal name with title and suffix", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        prefix: "Dr.",
        firstName: "Martin",
        middleName: "Luther",
        lastName: "King",
        suffix: "Jr",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: true,
        hasSuffix: true,
        tokenCount: 5,
      });
      expect(confidence).toBe(1.0);
    });

    test("lastname-first comma format", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "John",
        lastName: "Doe",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: true,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 2,
      });
      expect(confidence).toBe(1.0);
    });

    test("mononym (single name celebrity)", () => {
      const parsed: Omit<ParsedName, "confidence"> = {
        firstName: "Cher",
      };
      const confidence = calculateConfidence(parsed, {
        hasCommaFormat: false,
        hasPrefix: false,
        hasSuffix: false,
        tokenCount: 1,
      });
      expect(confidence).toBe(0.5);
    });
  });
});
