// node --experimental-modules index.js ~/Pictures/

import path from 'path';
import { statAsync } from '../promisified/index.js';
import { readPhotosDir } from './moveFiles/index.js';

const [node, file, photosDirOpt] = process.argv;
const dirname = path.resolve();

export const createPhotoLibrary = async () => {
    const photosDirPath = `${photosDirOpt}`;
    const statPath = await statAsync(photosDirPath);
    const isInputDir = statPath.isDirectory();

    if (isInputDir) {
        readPhotosDir(photosDirPath);
    } else {
        console.log(`${photosDirPath} is not a directory!`)
    }
};
