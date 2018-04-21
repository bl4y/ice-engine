import { TreeBuilder } from './tree-builder';
import { TreeParser } from './tree-parser';
import { Node } from './node';

export class Parser {
  static fromXml(source: string): Node[] {
    const treeBuilder: TreeBuilder = new TreeBuilder(source);
    return treeBuilder.process();
  }

  static toXml(nodeSet: Node[]): string {
    const treeParser: TreeParser = new TreeParser(nodeSet);
    return treeParser.process();
  }
}
