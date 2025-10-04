import { describe, it, expect } from "vitest";
import { extractPrefix, extractSuffix } from "./extract";

describe("extractPrefix", () => {
  describe("when prefix is present", () => {
    it("should extract Mr prefix", () => {
      const result = extractPrefix(["Mr", "John", "Smith"]);
      expect(result).toEqual({
        prefix: "Mr",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract Mr. prefix with period", () => {
      const result = extractPrefix(["Mr.", "John", "Smith"]);
      expect(result).toEqual({
        prefix: "Mr.",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract Dr prefix", () => {
      const result = extractPrefix(["Dr", "Sarah", "Johnson"]);
      expect(result).toEqual({
        prefix: "Dr",
        remainingTokens: ["Sarah", "Johnson"],
      });
    });

    it("should extract Dr. prefix with period", () => {
      const result = extractPrefix(["Dr.", "Sarah", "Johnson"]);
      expect(result).toEqual({
        prefix: "Dr.",
        remainingTokens: ["Sarah", "Johnson"],
      });
    });

    it("should extract Professor prefix", () => {
      const result = extractPrefix(["Professor", "Albert", "Einstein"]);
      expect(result).toEqual({
        prefix: "Professor",
        remainingTokens: ["Albert", "Einstein"],
      });
    });

    it("should extract Prof prefix", () => {
      const result = extractPrefix(["Prof", "Albert", "Einstein"]);
      expect(result).toEqual({
        prefix: "Prof",
        remainingTokens: ["Albert", "Einstein"],
      });
    });

    it("should extract military rank Captain", () => {
      const result = extractPrefix(["Captain", "James", "Kirk"]);
      expect(result).toEqual({
        prefix: "Captain",
        remainingTokens: ["James", "Kirk"],
      });
    });

    it("should extract military rank Capt.", () => {
      const result = extractPrefix(["Capt.", "James", "Kirk"]);
      expect(result).toEqual({
        prefix: "Capt.",
        remainingTokens: ["James", "Kirk"],
      });
    });

    it("should extract Reverend prefix", () => {
      const result = extractPrefix(["Reverend", "Martin", "King"]);
      expect(result).toEqual({
        prefix: "Reverend",
        remainingTokens: ["Martin", "King"],
      });
    });

    it("should extract Rev. prefix", () => {
      const result = extractPrefix(["Rev.", "Martin", "King"]);
      expect(result).toEqual({
        prefix: "Rev.",
        remainingTokens: ["Martin", "King"],
      });
    });

    it("should extract Honorable prefix", () => {
      const result = extractPrefix(["Honorable", "Ruth", "Ginsburg"]);
      expect(result).toEqual({
        prefix: "Honorable",
        remainingTokens: ["Ruth", "Ginsburg"],
      });
    });

    it("should extract Sir prefix", () => {
      const result = extractPrefix(["Sir", "Isaac", "Newton"]);
      expect(result).toEqual({
        prefix: "Sir",
        remainingTokens: ["Isaac", "Newton"],
      });
    });

    it("should be case insensitive - uppercase", () => {
      const result = extractPrefix(["MR", "John", "Smith"]);
      expect(result).toEqual({
        prefix: "MR",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should be case insensitive - mixed case", () => {
      const result = extractPrefix(["mR", "John", "Smith"]);
      expect(result).toEqual({
        prefix: "mR",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should preserve original casing", () => {
      const result = extractPrefix(["DR.", "John", "Smith"]);
      expect(result).toEqual({
        prefix: "DR.",
        remainingTokens: ["John", "Smith"],
      });
    });
  });

  describe("when prefix is not present", () => {
    it("should return all tokens when no prefix", () => {
      const result = extractPrefix(["John", "Smith"]);
      expect(result).toEqual({
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should not extract non-prefix words", () => {
      const result = extractPrefix(["Hello", "World"]);
      expect(result).toEqual({
        remainingTokens: ["Hello", "World"],
      });
    });

    it("should handle single token without prefix", () => {
      const result = extractPrefix(["Smith"]);
      expect(result).toEqual({
        remainingTokens: ["Smith"],
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const result = extractPrefix([]);
      expect(result).toEqual({
        remainingTokens: [],
      });
    });

    it("should handle prefix-only token array", () => {
      const result = extractPrefix(["Dr."]);
      expect(result).toEqual({
        prefix: "Dr.",
        remainingTokens: [],
      });
    });

    it("should not modify original tokens array", () => {
      const tokens = ["Mr", "John", "Smith"];
      const originalTokens = [...tokens];
      extractPrefix(tokens);
      expect(tokens).toEqual(originalTokens);
    });
  });

  describe("with custom prefixes", () => {
    it("should use custom prefix set when provided", () => {
      const customPrefixes = new Set(["chief", "boss"]);
      const result = extractPrefix(["Chief", "John", "Smith"], customPrefixes);
      expect(result).toEqual({
        prefix: "Chief",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should not extract default prefixes when custom set provided", () => {
      const customPrefixes = new Set(["chief"]);
      const result = extractPrefix(["Mr", "John", "Smith"], customPrefixes);
      expect(result).toEqual({
        remainingTokens: ["Mr", "John", "Smith"],
      });
    });

    it("should work with empty custom prefix set", () => {
      const customPrefixes = new Set<string>([]);
      const result = extractPrefix(["Dr", "John", "Smith"], customPrefixes);
      expect(result).toEqual({
        remainingTokens: ["Dr", "John", "Smith"],
      });
    });

    it("should be case insensitive with custom prefixes", () => {
      const customPrefixes = new Set(["chief"]);
      const result = extractPrefix(["CHIEF", "John", "Smith"], customPrefixes);
      expect(result).toEqual({
        prefix: "CHIEF",
        remainingTokens: ["John", "Smith"],
      });
    });
  });
});

describe("extractSuffix", () => {
  describe("single suffix", () => {
    it("should extract Jr suffix", () => {
      const result = extractSuffix(["Martin", "King", "Jr"]);
      expect(result).toEqual({
        suffix: "Jr",
        remainingTokens: ["Martin", "King"],
      });
    });

    it("should extract Jr. suffix with period", () => {
      const result = extractSuffix(["Martin", "King", "Jr."]);
      expect(result).toEqual({
        suffix: "Jr.",
        remainingTokens: ["Martin", "King"],
      });
    });

    it("should extract Sr suffix", () => {
      const result = extractSuffix(["John", "Smith", "Sr"]);
      expect(result).toEqual({
        suffix: "Sr",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract PhD suffix", () => {
      const result = extractSuffix(["Jane", "Doe", "PhD"]);
      expect(result).toEqual({
        suffix: "PhD",
        remainingTokens: ["Jane", "Doe"],
      });
    });

    it("should extract MD suffix", () => {
      const result = extractSuffix(["John", "Smith", "MD"]);
      expect(result).toEqual({
        suffix: "MD",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract Esq suffix", () => {
      const result = extractSuffix(["John", "Doe", "Esq"]);
      expect(result).toEqual({
        suffix: "Esq",
        remainingTokens: ["John", "Doe"],
      });
    });

    it("should extract roman numeral III", () => {
      const result = extractSuffix(["William", "Gates", "III"]);
      expect(result).toEqual({
        suffix: "III",
        remainingTokens: ["William", "Gates"],
      });
    });

    it("should extract roman numeral IV", () => {
      const result = extractSuffix(["John", "Smith", "IV"]);
      expect(result).toEqual({
        suffix: "IV",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should handle suffix with trailing comma", () => {
      const result = extractSuffix(["John", "Smith", "Jr,"]);
      expect(result).toEqual({
        suffix: "Jr,",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should be case insensitive - lowercase", () => {
      const result = extractSuffix(["John", "Smith", "jr"]);
      expect(result).toEqual({
        suffix: "jr",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should be case insensitive - uppercase", () => {
      const result = extractSuffix(["John", "Smith", "JR"]);
      expect(result).toEqual({
        suffix: "JR",
        remainingTokens: ["John", "Smith"],
      });
    });
  });

  describe("multiple suffixes", () => {
    it("should extract multiple consecutive suffixes", () => {
      const result = extractSuffix(["Robert", "Smith", "Jr", "PhD"]);
      expect(result).toEqual({
        suffix: "Jr PhD",
        remainingTokens: ["Robert", "Smith"],
      });
    });

    it("should extract three consecutive suffixes", () => {
      const result = extractSuffix(["John", "Doe", "Jr", "MD", "PhD"]);
      expect(result).toEqual({
        suffix: "Jr MD PhD",
        remainingTokens: ["John", "Doe"],
      });
    });

    it("should extract suffixes with periods", () => {
      const result = extractSuffix(["John", "Smith", "Jr.", "Ph.D."]);
      expect(result).toEqual({
        suffix: "Jr. Ph.D.",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract suffixes with commas", () => {
      const result = extractSuffix(["John", "Smith", "Jr,", "PhD"]);
      expect(result).toEqual({
        suffix: "Jr, PhD",
        remainingTokens: ["John", "Smith"],
      });
    });
  });

  describe("when suffix is not present", () => {
    it("should return all tokens when no suffix", () => {
      const result = extractSuffix(["John", "Smith"]);
      expect(result).toEqual({
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should not extract non-suffix words", () => {
      const result = extractSuffix(["Hello", "World"]);
      expect(result).toEqual({
        remainingTokens: ["Hello", "World"],
      });
    });

    it("should handle single token without suffix", () => {
      const result = extractSuffix(["Smith"]);
      expect(result).toEqual({
        remainingTokens: ["Smith"],
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const result = extractSuffix([]);
      expect(result).toEqual({
        remainingTokens: [],
      });
    });

    it("should handle suffix-only token array", () => {
      const result = extractSuffix(["Jr"]);
      expect(result).toEqual({
        suffix: "Jr",
        remainingTokens: [],
      });
    });

    it("should handle multiple suffix-only token array", () => {
      const result = extractSuffix(["Jr", "PhD"]);
      expect(result).toEqual({
        suffix: "Jr PhD",
        remainingTokens: [],
      });
    });

    it("should not modify original tokens array", () => {
      const tokens = ["John", "Smith", "Jr"];
      const originalTokens = [...tokens];
      extractSuffix(tokens);
      expect(tokens).toEqual(originalTokens);
    });

    it("should preserve original casing", () => {
      const result = extractSuffix(["John", "Smith", "JR.", "PHD"]);
      expect(result).toEqual({
        suffix: "JR. PHD",
        remainingTokens: ["John", "Smith"],
      });
    });
  });

  describe("with custom suffixes", () => {
    it("should use custom suffix set when provided", () => {
      const customSuffixes = new Set(["certified", "verified"]);
      const result = extractSuffix(
        ["John", "Smith", "Certified"],
        customSuffixes
      );
      expect(result).toEqual({
        suffix: "Certified",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should not extract default suffixes when custom set provided", () => {
      const customSuffixes = new Set(["certified"]);
      const result = extractSuffix(["John", "Smith", "Jr"], customSuffixes);
      expect(result).toEqual({
        remainingTokens: ["John", "Smith", "Jr"],
      });
    });

    it("should work with empty custom suffix set", () => {
      const customSuffixes = new Set<string>([]);
      const result = extractSuffix(["John", "Smith", "Jr"], customSuffixes);
      expect(result).toEqual({
        remainingTokens: ["John", "Smith", "Jr"],
      });
    });

    it("should be case insensitive with custom suffixes", () => {
      const customSuffixes = new Set(["certified"]);
      const result = extractSuffix(
        ["John", "Smith", "CERTIFIED"],
        customSuffixes
      );
      expect(result).toEqual({
        suffix: "CERTIFIED",
        remainingTokens: ["John", "Smith"],
      });
    });

    it("should extract multiple custom suffixes", () => {
      const customSuffixes = new Set(["certified", "verified", "approved"]);
      const result = extractSuffix(
        ["John", "Smith", "Certified", "Verified"],
        customSuffixes
      );
      expect(result).toEqual({
        suffix: "Certified Verified",
        remainingTokens: ["John", "Smith"],
      });
    });
  });
});
