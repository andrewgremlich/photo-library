import { readDirAsync, renameAsync } from './promisified/index.js';

import ExifImage from 'exif';
import mkdirp from 'mkdirp';

import dotenv from 'dotenv';

dotenv.config();

const { PHOTO_DIR } = process.env;

const moveImage = async (file, dest) => {
    await renameAsync(file, dest, err => {
        if (err) {
            console.log(err);
            return;
        }
    });
};

const mkDirs = correctDate => {
    const yearDir = `${PHOTO_DIR}${correctDate[0]}`;
    const monthDir = `${yearDir}/${correctDate[1]}`;
    const dayDir = `${monthDir}/${correctDate[2]}`;

    return new Promise((resolve, reject) => {
        mkdirp(dayDir, err => {
            if (err) console.log(err);
            resolve(dayDir);
        });
    });
};

const main = (async () => {
    const dirContents = await readDirAsync(PHOTO_DIR);

    dirContents.forEach(path => {
        const imageToRead = `${PHOTO_DIR}${path}`;

        try {
            new ExifImage({ image: imageToRead }, async (err, data) => {
                if (err) console.log(err);
                else {
                    const correctDate = data.exif.DateTimeOriginal.slice(0, 10).split(':');
                    const dirForPhotos = await mkDirs(correctDate);

                    await moveImage(imageToRead, `${dirForPhotos}/${path}`);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
})();
