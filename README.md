# ice-engine
Ice Engine is an *experimental*, lightweight and ultra high performance XML parsing **TypeScript** engine, implementing regex-free, tokenizing tree builder and output formatter.

# Getting started
## Installation
Add *ice-engine* to the dependencies of your **package.json**, or hit:
```sh
yarn add ice-engine
```
Don't forget to run `yarn` after updating the **package.json** file.

# Integration
```typescript
import { Parser as Ice } from 'ice-engine';

const nodes = Ice.fromXml(
  '<node id="1">' +
  'This is a text node.' +
  '<void id="2" />' +
  'This is an another text node.' +
  '</node>');
const source = Ice.toXml(nodes);
```

# License
MIT
