import { PREFIXES, SUFFIXES } from "./constants";

/**
 * Extract prefix from the beginning of tokens
 */
export function extractPrefix(
  tokens: string[],
  prefixes: Set<string> = PREFIXES
): {
  prefix?: string;
  remainingTokens: string[];
} {
  if (tokens.length === 0) {
    return { remainingTokens: tokens };
  }

  const firstToken = tokens[0];
  const normalized = firstToken.toLowerCase().replace(/\./g, "");

  if (prefixes.has(normalized)) {
    return {
      prefix: firstToken,
      remainingTokens: tokens.slice(1),
    };
  }

  return { remainingTokens: tokens };
}

/**
 * Extract suffix from the end of tokens
 */
export function extractSuffix(
  tokens: string[],
  suffixes: Set<string> = SUFFIXES
): {
  suffix?: string;
  remainingTokens: string[];
} {
  if (tokens.length === 0) {
    return { remainingTokens: tokens };
  }

  // Check last token
  const lastToken = tokens[tokens.length - 1];
  const cleanToken = lastToken.replace(/,$/g, "");
  const normalized = cleanToken.toLowerCase().replace(/\./g, "");

  if (suffixes.has(normalized)) {
    const suffixTokens: string[] = [];
    let i = tokens.length - 1;

    while (i >= 0) {
      const token = tokens[i];
      const clean = token.replace(/,$/g, "");
      const norm = clean.toLowerCase().replace(/\./g, "");

      if (suffixes.has(norm)) {
        suffixTokens.unshift(token);
        i--;
      } else {
        break;
      }
    }

    return {
      suffix: suffixTokens.join(" "),
      remainingTokens: tokens.slice(0, i + 1),
    };
  }

  return { remainingTokens: tokens };
}
