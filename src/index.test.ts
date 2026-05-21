import { describe, it, expect } from 'vitest';
import {
  toSnakeCase, toPascalCase, toCamelCase, toScreamingSnakeCase,
  dottedPathToSnakeCase, dottedPathToPascalCase,
  safeFieldName, isReservedKeyword, checkReservedKeyword,
  RESERVED_KEYWORDS,
  formatReservedWarning, formatReservedError,
} from './index.js';

// ── String case conversion ────────────────────────────────────────────────

describe('toSnakeCase', () => {
  const cases: [string, string][] = [
    ["HelloWorld", "hello_world"],
    ["HTMLElement", "h_t_m_l_element"],
    ["XMLParser", "x_m_l_parser"],
    ["single", "single"],
    ["TwoWords", "two_words"],
    ["ABC", "a_b_c"],
    ["", ""],
  ];
  it.each(cases)('%s → %s', (input, expected) => {
    expect(toSnakeCase(input)).toBe(expected);
  });
});

describe('toPascalCase', () => {
  it('hello_world → HelloWorld', () => expect(toPascalCase('hello_world')).toBe('HelloWorld'));
  it('single → Single', () => expect(toPascalCase('single')).toBe('Single'));
  it('xml_parser → XmlParser', () => expect(toPascalCase('xml_parser')).toBe('XmlParser'));
});

describe('toCamelCase', () => {
  it('hello_world → helloWorld', () => expect(toCamelCase('hello_world')).toBe('helloWorld'));
  it('single → single', () => expect(toCamelCase('single')).toBe('single'));
});

describe('toScreamingSnakeCase', () => {
  it('HelloWorld → HELLO_WORLD', () => expect(toScreamingSnakeCase('HelloWorld')).toBe('HELLO_WORLD'));
  it('single → SINGLE', () => expect(toScreamingSnakeCase('single')).toBe('SINGLE'));
});

// ── Dotted path conversion ────────────────────────────────────────────────

describe('dottedPathToSnakeCase', () => {
  it('MyNs.SubA → my_ns_sub_a', () => expect(dottedPathToSnakeCase('MyNs.SubA')).toBe('my_ns_sub_a'));
  it('AllTypes → all_types', () => expect(dottedPathToSnakeCase('AllTypes')).toBe('all_types'));
  it('a.b.c → a_b_c', () => expect(dottedPathToSnakeCase('a.b.c')).toBe('a_b_c'));
});

describe('dottedPathToPascalCase', () => {
  it('my_ns.sub_a → MyNsSubA', () => expect(dottedPathToPascalCase('my_ns.sub_a')).toBe('MyNsSubA'));
  it('all_types → AllTypes', () => expect(dottedPathToPascalCase('all_types')).toBe('AllTypes'));
});

// ── Reserved keywords ─────────────────────────────────────────────────────

describe('RESERVED_KEYWORDS', () => {
  it('has all 15 languages', () => {
    const langs = Object.keys(RESERVED_KEYWORDS);
    expect(langs).toHaveLength(15);
    expect(langs).toContain('python');
    expect(langs).toContain('cpp');
    expect(langs).toContain('elixir');
    expect(langs).toContain('typescript');
    expect(langs).toContain('java');
  });
});

describe('isReservedKeyword', () => {
  it('class is reserved', () => expect(isReservedKeyword('class')).toBe(true));
  it('def is reserved', () => expect(isReservedKeyword('def')).toBe(true));
  it('zzz is not reserved', () => expect(isReservedKeyword('zzz')).toBe(false));
});

describe('checkReservedKeyword', () => {
  it('class is reserved in python, dart, kotlin, ...', () => {
    const langs = checkReservedKeyword('class');
    expect(langs.length).toBeGreaterThan(0);
  });
  it('zzz is not reserved anywhere', () => {
    expect(checkReservedKeyword('zzz')).toEqual([]);
  });
});

describe('safeFieldName', () => {
  it('python: class → class_', () => expect(safeFieldName('python', 'class')).toBe('class_'));
  it('python: normal_name → normal_name', () => expect(safeFieldName('python', 'normal_name')).toBe('normal_name'));
  it('cpp: class → class_', () => expect(safeFieldName('cpp', 'class')).toBe('class_'));
  it('typescript: class → class_', () => expect(safeFieldName('typescript', 'class')).toBe('class_'));
  it('elixir: end → end_', () => expect(safeFieldName('elixir', 'end')).toBe('end_'));
  it('elixir: def → def_', () => expect(safeFieldName('elixir', 'def')).toBe('def_'));
  it('go: func → func_', () => expect(safeFieldName('go', 'func')).toBe('func_'));
  it('java: class → class_', () => expect(safeFieldName('java', 'class')).toBe('class_'));
  it('rust: impl → impl_', () => expect(safeFieldName('rust', 'impl')).toBe('impl_'));
  it('kotlin: class → class_', () => expect(safeFieldName('kotlin', 'class')).toBe('class_'));
  it('csharp: class → class_', () => expect(safeFieldName('csharp', 'class')).toBe('class_'));
  it('swift: class → class_', () => expect(safeFieldName('swift', 'class')).toBe('class_'));
  it('dart: class → class_', () => expect(safeFieldName('dart', 'class')).toBe('class_'));
  it('php: class → class_', () => expect(safeFieldName('php', 'class')).toBe('class_'));
  it('ruby: class → class_', () => expect(safeFieldName('ruby', 'class')).toBe('class_'));
  it('scala: class → class_', () => expect(safeFieldName('scala', 'class')).toBe('class_'));
  it('fsharp: class → class_', () => expect(safeFieldName('fsharp', 'class')).toBe('class_'));
});

// ── Diagnostic message formatting ────────────────────────────────────────

describe('formatReservedWarning', () => {
  it('single language', () => {
    expect(formatReservedWarning('retry', 'OptCombo10', ['ruby']))
      .toContain('retry');
    expect(formatReservedWarning('retry', 'OptCombo10', ['ruby']))
      .toContain('Ruby');
  });
  it('two languages', () => {
    expect(formatReservedWarning('type', 'Foo', ['python', 'go']))
      .toContain('Python');
    expect(formatReservedWarning('type', 'Foo', ['python', 'go']))
      .toContain('Go');
  });
  it('three+ languages', () => {
    expect(formatReservedWarning('class', 'Bar', ['python', 'java', 'cpp']))
      .toContain('Python');
  });
});

describe('formatReservedError', () => {
  it('mentions --ignore-reserved-keywords', () => {
    expect(formatReservedError('class', 'Foo', ['python']))
      .toContain('--ignore-reserved-keywords');
  });
});
