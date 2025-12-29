# Inquirer.js Upgrade - Searchable Lists

After restarting terminal with Node 20.12+, run these commands:

## 1. Install @inquirer/search

```bash
cd wp-content/themes/dgwltd-theme
npm install @inquirer/search --save-dev
```

## 2. Update inquirer.mjs

Replace lines 1-12 with:

```javascript
import path from 'node:path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import search from '@inquirer/search';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const Separator = inquirer.Separator;
```

Then replace the `selectPostType` function (around line 134-147) with:

```javascript
// ─────────────────────────────────────────────────
// SEARCHABLE POST TYPE SELECTION
// ─────────────────────────────────────────────────
async function selectPostType(postTypes) {
  return await search({
    message: 'Select post type (type to search):',
    source: async (term) => {
      const filtered = postTypes.filter(pt =>
        pt.name.toLowerCase().includes((term || '').toLowerCase())
      );
      return filtered.map(pt => ({
        name: pt.name,
        value: pt.value,
        description: `Export ${pt.value} content`
      }));
    }
  });
}
```

## 3. Test

```bash
npm run inquirer
```

---

**Or just ask Claude Code to "add searchable lists to inquirer.mjs"** after restarting your terminal.
