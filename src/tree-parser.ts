import { Node } from './node';

export class TreeParser {
  private output: string[];

  constructor (
    private rootNodeSet: Node[]
  ) {
    this.output = [];
  }

  process(): string {
    const onlyElementChildrenNodes = this.rootNodeSet.filter(child => child._type !== 'element').length === 0;
    for (let node of this.rootNodeSet) {
      this.visit(node, 0, onlyElementChildrenNodes);
    }
    return this.output.join('');
  }

  visit(node: Node, level: number, onlyElementNodes: boolean) {
    switch (node._type) {
      case 'element':
        const spaces = [];
        if (onlyElementNodes) {
          for (let i = 0; i < level; ++i) {
            spaces.push(' ');
          }
          this.output.push('\n', spaces.join(''));
        }
        this.output.push('<', node._value);
        if (node._attr.length > 0) {
          this.output.push(' ', this.processAttributes(node));
        }
        if (node._children.length > 0) {
          this.output.push('>');
          const onlyElementChildrenNodes = node._children.filter(child => child._type !== 'element').length === 0;
          for (let childNode of node._children) {
            this.visit(childNode, onlyElementChildrenNodes ? level + 1 : level, onlyElementChildrenNodes);
          }
          if (onlyElementChildrenNodes) {
            this.output.push('\n', spaces.join(''));
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
        this.output.push('?>', '\n');
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
