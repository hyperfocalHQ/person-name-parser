# Person Name Parser

[![npm version](https://flat.badgen.net/npm/v/person-name-parser)](https://www.npmjs.com/package/person-name-parser)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/person-name-parser)](https://bundlephobia.com/package/person-name-parser)
[![build status](https://flat.badgen.net/github/checks/hyperfocalHQ/person-name-parser)](https://github.com/hyperfocalHQ/person-name-parser/actions)
[![license](https://flat.badgen.net/github/license/hyperfocalHQ/person-name-parser)](https://github.com/hyperfocalHQ/person-name-parser/blob/main/LICENSE.md)

A lightweight utility that attempts to parses a person's full name into its constituent parts (prefix, first name, middle name, last name, suffix) with a confidence rating.

## Features

- Prefixes & suffixes: Parses titles (Dr., Prof.) and suffixes (Jr., PhD, III)
- Initials: Groups consecutive initials intelligently (e.g., "T. S. Eliot")
- Particles: Recognizes particles like "van", "von", "de", "da" for compound surnames
- Nicknames: Removes nicknames in quotes or parentheses
- Comma format: Supports "Last, First Middle" format
- Confidence scoring: Returns a confidence rating for the parse result
- Zero dependencies

## Installation

```bash
npm install person-name-parser
```

## Usage

### Basic Example

```typescript
import { parseName } from "person-name-parser";

const result = parseName("John Smith");
console.log(result);
// {
//   firstName: 'John',
//   lastName: 'Smith',
//   confidence: 1.0
// }
```

### With All Name Parts

```typescript
const result = parseName("Dr. Martin Luther King Jr");
console.log(result);
// {
//   prefix: 'Dr.',
//   firstName: 'Martin',
//   middleName: 'Luther',
//   lastName: 'King',
//   suffix: 'Jr',
//   confidence: 1.0
// }
```

### Compound Surnames with Particles

```typescript
const result = parseName("Ludwig van Beethoven");
console.log(result);
// {
//   firstName: 'Ludwig',
//   lastName: 'van Beethoven',
//   confidence: 1.0
// }
```

### Initials

```typescript
const result = parseName("T. S. Eliot");
console.log(result);
// {
//   firstName: 'T. S.',
//   lastName: 'Eliot',
//   confidence: 1.0
// }
```

### Comma-Separated Format

```typescript
const result = parseName("King, Martin Luther");
console.log(result);
// {
//   firstName: 'Martin',
//   middleName: 'Luther',
//   lastName: 'King',
//   confidence: 1.0
// }
```

### Nicknames

```typescript
const result = parseName('William "Bill" Gates');
console.log(result);
// {
//   firstName: 'William',
//   lastName: 'Gates',
//   confidence: 1.0
// }
```

### Custom Options

You can provide custom sets of prefixes, suffixes, and particles:

```typescript
const result = parseName("Sir Arthur Conan Doyle", {
  prefixes: new Set(["Sir", "Mr", "Mrs", "Dr", "Dr.", "Prof", "Prof."]),
  suffixes: new Set(["Jr", "Sr", "III", "PhD", "MD"]),
  particles: new Set(["van", "von", "de", "da", "del"]),
});
```

## API Reference

### `parseName(fullName, options?)`

Parses a full name string into its constituent parts.

**Parameters:**

- `fullName` (string | null | undefined) - The full name to parse
- `options` (ParseOptions, optional) - Parsing options

**Returns:** `ParsedName`

### `ParsedName`

```typescript
type ParsedName = {
  prefix?: string; // Title or honorific (Dr., Mr., Prof.)
  firstName?: string; // Given name
  middleName?: string; // Middle name(s)
  lastName?: string; // Surname/family name
  suffix?: string; // Generational or academic suffixes (Jr., PhD, III)
  confidence: number; // Confidence score (0-1)
};
```

### `ParseOptions`

```typescript
type ParseOptions = {
  prefixes?: Set<string>; // Custom set of recognized prefixes
  suffixes?: Set<string>; // Custom set of recognized suffixes
  particles?: Set<string>; // Custom set of surname particles
};
```

### Confidence Score

The confidence score ranges from 0 to 1 and indicates how confident the parser is about the result:

- **1.0** - High confidence (typical multi-part names with clear structure)
- **0.5** - Medium confidence (single-word names)
- **0.0** - No confidence (empty/invalid input)

The score is calculated based on:

- Number of name tokens
- Presence of recognizable prefixes and suffixes
- Use of comma-separated format

## Supported Name Patterns

- **Simple names**: "John Smith"
- **Middle names**: "John David Smith"
- **Multiple middle names**: "John Paul George Ringo Starr"
- **Prefixes**: "Dr. Jane Doe", "Professor Albert Einstein"
- **Suffixes**: "Martin Luther King Jr", "William Gates III"
- **Multiple suffixes**: "Robert Smith Jr, PhD"
- **Particles**: "Ludwig van Beethoven", "Leonardo da Vinci"
- **Initials**: "John F. Kennedy", "T. S. Eliot"
- **Nicknames**: "William 'Bill' Gates", 'Robert "Bob" Smith'
- **Comma format**: "Last, First Middle", "Last, Prefix First Middle Suffix"
- **Complex combinations**: "Prof. Johann von Neumann PhD"

## Limitations

This library is currently optimized for **Western naming conventions** and may not handle all global naming patterns accurately.

**Current limitations:**

- Primarily designed for English/European name structures
- May not correctly parse names from cultures with different conventions (e.g., Eastern Asian names where family name comes first, Arabic patronymics, etc.)
- Limited support for non-Latin scripts
- Assumes space-separated name components

**Future improvements:**

It would be good to make the parser configurable to support diverse cultural naming conventions, including:

- Configurable name order (family-name-first vs. given-name-first)
- Better support for non-Western particles and honorifics
- Locale-aware parsing strategies
- Support for mononyms and patronymic naming systems

Contributions and feedback are welcome to help improve support for diverse naming conventions!

## Development

```bash
# Run tests
npm test

# Run tests with coverage
npm run test

# Build
npm run build

# Type check
npm run check
```

## License

MIT License - Copyright 2025 Hyperfocal Group Ltd

See [LICENSE.md](LICENSE.md) for details.

## Contributing

Issues and pull requests are welcome! Please feel free to contribute at [github.com/hyperfocalHQ/person-name-parser](https://github.com/hyperfocalHQ/person-name-parser).
