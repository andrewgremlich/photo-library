import { promisify } from 'util';

import { readdir, rename, stat } from 'fs';

export const readDirAsync = promisify(readdir);
export const renameAsync = promisify(rename);
export const statAsync = promisify(stat);