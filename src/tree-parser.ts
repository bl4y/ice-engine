import { Node } from './node';

export class TreeParser {
  private output: string[];

  constructor (
    private rootNodeSet: Node[]
  ) {
    this.output = [];
  }

  process(): string {
    for (let node of this.rootNodeSet) {
      this.visit(node);
    }
    return this.output.join('');
  }

  visit(node: Node) {
    switch (node._type) {
      case 'element':
        this.output.push('<', node._value);
        if (node._attr.length > 0) {
          this.output.push(' ', this.processAttributes(node));
        }
        if (node._children.length > 0) {
          this.output.push('>');
          for (let childNode of node._children) {
            this.visit(childNode);
          }
          this.output.push('</', node._value, '>');
        } else {
          this.output.push('/>');
        }
        break;
      case 'prolog':
        this.output.push('<?', node._value);
        if (node._attr.length > 0) {
          this.output.push(' ', this.processAttributes(node));
        }
        this.output.push('?>');
        break;
      case 'text':
        this.output.push(node._value);
        break;
      case 'cdata':
        this.output.push('<![CDATA[', node._value, ']]>');
        break;
      case 'comment':
        this.output.push('<!--', node._value, '-->');
        break;
    }
  }

  processAttributes(node: Node): string {
    const nodeAttributes = [];
    for (let nodeAttribute of node._attr) {
      const quoteChar = nodeAttribute._value.includes('"') ? '\'' : '"';
      nodeAttributes.push([ nodeAttribute._name, '=', quoteChar, nodeAttribute._value, quoteChar ].join(''));
    }
    return nodeAttributes.join(' ');
  }
}
