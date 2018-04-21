export interface NodeAttribute {
  _name: string;
  _value: string;
}

export interface Node {
  _type: 'prolog' | 'element' | 'text' | 'cdata' | 'comment';
  _attr: NodeAttribute[];
  _children: Node[];
  _value: string;
}
