import path from 'path';
import { statAsync } from './promisified/index.js';
import { readPhotosDir } from './app/index.js';

const [node, file, photosDirOpt] = process.argv;
const dirname = path.resolve();

const main = (async () => {
    const photosDirPath = `${dirname}/${photosDirOpt}`;
    const statPath = await statAsync(photosDirPath);
    const isInputDir = statPath.isDirectory();

    if (isInputDir) {
        readPhotosDir(photosDirPath);
    } else {
        console.log(`${photosDirPath} is not a directory!`)
    }
})();
