/* v8 ignore start */
export type ParsedName = {
  prefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  confidence: number;
};

export type ParseOptions = {
  prefixes?: Set<string>;
  suffixes?: Set<string>;
  particles?: Set<string>;
};
/* v8 ignore stop */
