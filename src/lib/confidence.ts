import type { ParsedName } from "../types";

/**
 * Calculate confidence score for the parsed name
 * Returns a value between 0 and 1
 */
export function calculateConfidence(
  parsed: Omit<ParsedName, "confidence">,
  factors: {
    hasCommaFormat: boolean;
    hasPrefix: boolean;
    hasSuffix: boolean;
    tokenCount: number;
  }
): number {
  let confidence = 1.0;

  if (!parsed.firstName && !parsed.lastName) {
    return 0.1; // Very low confidence if we have neither first nor last
  }

  if (!parsed.firstName || !parsed.lastName) {
    confidence -= 0.3; // Missing one major component
  }

  // Comma format is very reliable
  if (factors.hasCommaFormat) {
    confidence = Math.min(confidence + 0.1, 1.0);
  }

  // Recognized prefix/suffix increases confidence
  if (factors.hasPrefix) {
    confidence = Math.min(confidence + 0.05, 1.0);
  }

  if (factors.hasSuffix) {
    confidence = Math.min(confidence + 0.05, 1.0);
  }

  // Single token names are less reliable
  if (factors.tokenCount === 1) {
    confidence -= 0.2;
  }

  // Very long names (>5 tokens) might be organizations or malformed
  if (factors.tokenCount > 5) {
    confidence -= 0.1;
  }

  return Math.max(0, Math.min(1.0, confidence));
}
