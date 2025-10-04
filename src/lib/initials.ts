/**
 * Check if a token is an initial (single letter or single letter + period)
 */
export function isInitial(token: string): boolean {
  const clean = token.replace(/\./g, "");
  return clean.length === 1 && /^[a-zA-Z]$/.test(clean);
}

/**
 * Group consecutive initials together
 * E.g., ["J.", "R.", "R.", "Tolkien"] -> ["J. R. R.", "Tolkien"]
 */
export function groupInitials(tokens: string[]): string[] {
  if (tokens.length <= 1) {
    return tokens;
  }

  const result: string[] = [];
  let currentGroup: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (isInitial(token)) {
      currentGroup.push(token);
    } else {
      if (currentGroup.length > 0) {
        result.push(currentGroup.join(" "));
        currentGroup = [];
      }
      result.push(token);
    }
  }

  if (currentGroup.length > 0) {
    result.push(currentGroup.join(" "));
  }

  return result;
}
