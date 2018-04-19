import { Node, TreeBuilder } from './tree-builder';

export class Parser {
  static fromXml(source: string): Node[] {
    const treeBuilder: TreeBuilder = new TreeBuilder(source);
    return treeBuilder.process();
  }

  static toXml(nodeSet: Node[]): string {
    return '';
  }
}
