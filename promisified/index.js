import { promisify } from 'util';

import { readdir, rename } from 'fs';

export const readDirAsync = promisify(readdir);
export const renameAsync = promisify(rename);
