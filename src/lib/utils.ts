/**
 * Strip nicknames from the name string
 * Handles: "William 'Bill' Gates", 'John (Johnny) Doe', etc.
 */
export function stripNicknames(name: string): string {
  name = name.replace(/'[^']*'/g, "");
  name = name.replace(/"[^"]*"/g, "");
  name = name.replace(/\([^)]*\)/g, "");
  return name.replace(/\s+/g, " ").trim();
}
