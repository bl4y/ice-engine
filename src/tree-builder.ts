import * as CHAR from './chars';
import { Node, NodeAttribute } from './node';

export class TreeBuilder {
  private position = -1;
  private current = CHAR.NUL;

  private rootNodeSet: Node[];
  private currentNodeSet: Node[];
  private nodeStack: Node[][];

  constructor (
    private source: string
  ) {
    this.currentNodeSet = this.rootNodeSet = [];
    this.nodeStack = [];
    this.peek();
  }

  peek(times: number = 1) {
    this.position += times;
    this.current = this.position >= this.source.length ? CHAR.NUL : this.source.charCodeAt(this.position);
  }

  peekUntil(predicate: (code: number) => boolean) {
    while (predicate(this.current)) {
      this.peek();
    }
  }

  checkAndPeek(code: number): boolean {
    if (this.current === code) {
      this.peek();
      return true;
    }
    return false;
  }

  checkCharsAndPeek(chars: string): boolean {
    if (this.source.startsWith(chars, this.position)) {
      this.peek(chars.length);
      return true;
    }
    return false;
  }

  requireAndPeek(code: number) {
    if (this.current !== code) {
      throw new Error('Expected character "' + String.fromCharCode(code) + '" at location ' + this.position + ', but got "' +
        String.fromCharCode(this.current) + '".');
    }
    this.peek();
  }

  requireCharsAndPeek(chars: string) {
    const length = chars.length;
    for (let i = 0; i < length; i++) {
      this.requireAndPeek(chars.charCodeAt(i));
    }
  }

  process(): Node[] {
    while (this.current !== CHAR.NUL) {
      if (this.checkAndPeek(CHAR.LESSER_THAN)) {
        if (this.checkAndPeek(CHAR.EXCLAMATION_MARK)) {
          if (this.checkAndPeek(CHAR.MINUS)) {
            this.processComment();
          } else if (this.checkAndPeek(CHAR.LEFT_BRACKET)) {
            this.processCdata();
          } else {
            this.processDoctype();
          }
        } else if (this.checkAndPeek(CHAR.QUESTION_MARK)) {
          this.processProlog();
        } else if (this.checkAndPeek(CHAR.SLASH)) {
          this.processTagClose();
        } else {
          this.processTagOpen();
        }
      } else {
        this.processText();
      }
    }
    return this.rootNodeSet;
  }

  processProlog() {
    this.peekUntil(CHAR.isWhitespace);
    const name = this.processName();
    const node: Node = {
      _type: 'prolog',
      _value: name,
      _attr: [],
      _children: undefined
    };
    this.peekUntil(CHAR.isWhitespace);
    while (!this.checkCharsAndPeek('?>')) {
      const attributeName = this.processName();
      this.peekUntil(CHAR.isWhitespace);
      if (this.checkAndPeek(CHAR.EQUALS)) {
        this.peekUntil(CHAR.isWhitespace);
        node._attr.push({
          _name: attributeName,
          _value: this.processValue()
        });
      }
      this.peekUntil(CHAR.isWhitespace);
    }
    this.addNode(node);
  }

  processTagOpen() {
    this.peekUntil(CHAR.isWhitespace);
    const name = this.processName();
    const node: Node = {
      _type: 'element',
      _value: name,
      _attr: [],
      _children: []
    };
    this.peekUntil(CHAR.isWhitespace);
    while (!CHAR.isTagEnd(this.current)) {
      const attributeName = this.processName();
      this.peekUntil(CHAR.isWhitespace);
      if (this.checkAndPeek(CHAR.EQUALS)) {
        this.peekUntil(CHAR.isWhitespace);
        node._attr.push({
          _name: attributeName,
          _value: this.processValue()
        });
      }
      this.peekUntil(CHAR.isWhitespace);
    }
    this.addNode(node);
    if (this.checkAndPeek(CHAR.SLASH)) {
      this.jumpToParentNode();
    }
    this.requireAndPeek(CHAR.GREATER_THAN);
  }

  processTagClose() {
    this.peekUntil(CHAR.isWhitespace);
    const name = this.processName();
    this.peekUntil(CHAR.isWhitespace);
    this.requireAndPeek(CHAR.GREATER_THAN);
    this.jumpToParentNode();
  }

  processComment() {
    this.requireAndPeek(CHAR.MINUS);
    const comment = this.processTextUntilPredicate(code => !this.checkCharsAndPeek('-->'));
    this.addNode({
      _type: 'comment',
      _attr: undefined,
      _children: undefined,
      _value: comment
    });
  }

  processCdata() {
    this.requireCharsAndPeek('CDATA[');
    const cdata = this.processTextUntilPredicate(code => !this.checkCharsAndPeek(']]>'));
    this.addNode({
      _type: 'cdata',
      _attr: undefined,
      _children: undefined,
      _value: cdata
    });
  }

  processDoctype() {
    this.peekUntil(code => code !== CHAR.GREATER_THAN);
    this.peek();
  }

  processName(): string {
    const start = this.position;
    while (CHAR.isName(this.current)) {
      this.peek();
    }
    return this.source.substring(start, this.position);
  }

  processValue(): string {
    const start = this.position;
    if (this.current === CHAR.DOUBLE_QUOTES || this.current === CHAR.SINGLE_QUOTE) {
      const quoteCode = this.current;
      this.peek();
      let value = [];
      while (this.current !== quoteCode) {
        value.push(String.fromCharCode(this.current));
        this.peek();
      }
      this.peek();
      return value.join('');
    }
    this.peekUntil(CHAR.isName);
    return this.source.substring(start, this.current);
  }

  processText() {
    const text = this.processTextUntilPredicate(code => code !== CHAR.LESSER_THAN && code !== CHAR.NUL);
    this.addNode({
      _type: 'text',
      _attr: undefined,
      _children: undefined,
      _value: text
    });
  }

  processTextUntilPredicate(predicate: (code: number) => boolean): string {
    let value = [];
    do {
      value.push(String.fromCharCode(this.current));
      this.peek();
    } while (predicate(this.current));
    return value.join('');
  }

  addNode(node: Node) {
    this.currentNodeSet.push(node);
    if (node._children) {
      this.nodeStack.push(this.currentNodeSet);
      this.currentNodeSet = node._children;
    }
  }

  jumpToParentNode() {
    this.currentNodeSet = this.nodeStack.pop();
  }
}
