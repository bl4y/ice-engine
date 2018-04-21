export const NUL = 0;

export const HORIZONTAL_TAB = 9;
export const LINE_FEED = 10;
export const CARRIAGE_RETURN = 13;
export const SPACE = 32;
export const EXCLAMATION_MARK = 33;
export const DOUBLE_QUOTES = 34;
export const SINGLE_QUOTE = 39;
export const MINUS = 45;
export const SLASH = 47;

export const DIGIT_0 = 48;
export const DIGIT_9 = 57;

export const COLON = 58;

export const LESSER_THAN = 60;
export const EQUALS = 61;
export const GREATER_THAN = 62;
export const QUESTION_MARK = 63;

export const LETTER_A = 65;
export const LETTER_Z = 90;

export const LEFT_BRACKET = 91;
export const BACKSLASH = 92;
export const RIGHT_BRACKET = 93;

export const LETTER_a = 97;
export const LETTER_z = 122;

// Reference: https://www.w3.org/TR/REC-xml/REC-xml-20081126-review.html#sec-common-syn
export function isWhitespace(code: number): boolean {
  return code === HORIZONTAL_TAB || code === LINE_FEED || code === SPACE || code === CARRIAGE_RETURN;
}

// Reference: ?
export function isName(code: number): boolean {
  return !isWhitespace(code) && code !== GREATER_THAN && code !== SLASH && code !== SINGLE_QUOTE &&
    code !== DOUBLE_QUOTES && code !== EQUALS;
}

// Reference: ?
export function isTagEnd(code: number): boolean {
  return code === SLASH || code === GREATER_THAN;
}
