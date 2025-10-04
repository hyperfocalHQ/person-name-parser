import { PARTICLES } from "./lib/constants";
import { stripNicknames } from "./lib/utils";
import { groupInitials } from "./lib/initials";
import { extractPrefix, extractSuffix } from "./lib/extract";
import { calculateConfidence } from "./lib/confidence";
import type { ParsedName, ParseOptions } from "./types";
export type { ParsedName, ParseOptions } from "./types";

/**
 * Parse a full name string into its constituent parts
 */
export function parseName(
  fullName: string | null | undefined,
  options?: ParseOptions
): ParsedName {
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    return { confidence: 0 };
  }

  let workingName = fullName.trim();
  const result: ParsedName = { confidence: 1.0 };
  let confidenceFactors = {
    hasCommaFormat: false,
    hasPrefix: false,
    hasSuffix: false,
    tokenCount: 0,
  };

  const commaIndex = workingName.indexOf(",");
  if (commaIndex > 0 && commaIndex < workingName.length - 1) {
    const parsed = parseCommaFormat(workingName, options);
    const commaConfidenceFactors = {
      hasCommaFormat: true,
      hasPrefix: !!parsed.prefix,
      hasSuffix: !!parsed.suffix,
      tokenCount: workingName.split(/\s+/).length,
    };
    return {
      ...parsed,
      confidence: calculateConfidence(parsed, commaConfidenceFactors),
    };
  }

  workingName = stripNicknames(workingName);

  let tokens = tokenize(workingName);
  if (tokens.length === 0) {
    return { confidence: 0 };
  }

  confidenceFactors.tokenCount = tokens.length;

  const prefixResult = extractPrefix(tokens, options?.prefixes);
  if (prefixResult.prefix) {
    result.prefix = prefixResult.prefix;
    tokens = prefixResult.remainingTokens;
    confidenceFactors.hasPrefix = true;
  }

  const suffixResult = extractSuffix(tokens, options?.suffixes);
  if (suffixResult.suffix) {
    result.suffix = suffixResult.suffix;
    tokens = suffixResult.remainingTokens;
    confidenceFactors.hasSuffix = true;
  }

  const names = parseNameTokens(tokens, options?.particles);
  result.firstName = names.firstName;
  result.middleName = names.middleName;
  result.lastName = names.lastName;

  result.confidence = calculateConfidence(result, confidenceFactors);
  return result;
}

/**
 * Parse comma-separated format: "Last, First Middle" or "Last, Prefix First Middle Suffix"
 */
function parseCommaFormat(
  name: string,
  options?: ParseOptions
): Omit<ParsedName, "confidence"> {
  const parts = name.split(",").map((p) => p.trim());

  if (parts.length !== 2) {
    return {};
  }

  const [lastPart, firstPart] = parts;
  const result: Omit<ParsedName, "confidence"> = {};

  let lastTokens = tokenize(lastPart);
  const lastSuffixResult = extractSuffix(lastTokens, options?.suffixes);
  if (lastSuffixResult.suffix) {
    result.suffix = lastSuffixResult.suffix;
    lastTokens = lastSuffixResult.remainingTokens;
  }
  result.lastName = lastTokens.join(" ");

  let firstTokens = tokenize(firstPart);

  const prefixResult = extractPrefix(firstTokens, options?.prefixes);
  if (prefixResult.prefix) {
    result.prefix = prefixResult.prefix;
    firstTokens = prefixResult.remainingTokens;
  }

  const firstSuffixResult = extractSuffix(firstTokens, options?.suffixes);
  if (firstSuffixResult.suffix) {
    result.suffix = result.suffix
      ? `${result.suffix} ${firstSuffixResult.suffix}`
      : firstSuffixResult.suffix;
    firstTokens = firstSuffixResult.remainingTokens;
  }

  const groupedFirstTokens = groupInitials(firstTokens);

  if (groupedFirstTokens.length > 0) {
    result.firstName = groupedFirstTokens[0];
    if (groupedFirstTokens.length > 1) {
      result.middleName = groupedFirstTokens.slice(1).join(" ");
    }
  }

  return result;
}

/**
 * Tokenize name string into parts, preserving certain punctuation
 */
function tokenize(name: string): string[] {
  const parts = name.split(/\s+/).filter((part) => part.length > 0);
  return parts;
}

/**
 * Parse remaining tokens into first, middle, and last names
 */
function parseNameTokens(
  tokens: string[],
  particles: Set<string> = PARTICLES
): Pick<ParsedName, "firstName" | "middleName" | "lastName"> {
  if (tokens.length === 0) {
    return {};
  }

  if (tokens.length === 1) {
    return { firstName: tokens[0] };
  }

  if (tokens.length === 2) {
    return {
      firstName: tokens[0],
      lastName: tokens[1],
    };
  }

  let lastNameStartIndex = tokens.length - 1;

  for (let i = tokens.length - 2; i >= 1; i--) {
    const token = tokens[i];
    const normalized = token.toLowerCase().replace(/\./g, "");

    if (particles.has(normalized)) {
      lastNameStartIndex = i;
    } else {
      break;
    }
  }

  const groupedTokens = groupInitials(tokens);

  const firstName = groupedTokens[0];

  lastNameStartIndex = groupedTokens.length - 1;
  for (let i = groupedTokens.length - 2; i >= 1; i--) {
    const token = groupedTokens[i];
    const normalized = token.toLowerCase().replace(/\./g, "");

    if (particles.has(normalized)) {
      lastNameStartIndex = i;
    } else {
      break;
    }
  }

  const lastName = groupedTokens.slice(lastNameStartIndex).join(" ");

  let middleName: string | undefined;
  if (lastNameStartIndex > 1) {
    middleName = groupedTokens.slice(1, lastNameStartIndex).join(" ");
  }

  return {
    firstName,
    middleName,
    lastName,
  };
}
