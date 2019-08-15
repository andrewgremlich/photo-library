import ExifImage from 'exif';
import mkdirp from 'mkdirp';

import { readDirAsync, renameAsync, statAsync } from '../promisified/index.js';

const moveImage = async (file, dest) => {
    await renameAsync(file, dest, err => {
        if (err) {
            console.log(err);
            return;
        }
    });
};

const mkDirs = (correctDate, photosDir) => {
    const yearDir = `${photosDir}${correctDate[0]}`;
    const monthDir = `${yearDir}/${correctDate[1]}`;
    const dayDir = `${monthDir}/${correctDate[2]}`;

    return new Promise((resolve, reject) => {
        mkdirp(dayDir, err => {
            if (err) console.log(err);
            resolve(dayDir);
        });
    });
};

const photo_white_list = ['jpeg', 'jpg', 'JPEG', 'JPG'];

export const readPhotosDir = async (photosDir) => {
    const dirContents = await readDirAsync(`${photosDir}`);

    dirContents.forEach(async path => {
        const imageToRead = `${photosDir}${path}`;
        const statPath = await statAsync(imageToRead);

        if (photo_white_list.filter(pathr => path.includes(pathr)) && !statPath.isDirectory()) {
            try {
                new ExifImage({ image: imageToRead }, async (err, data) => {
                    if (err) console.log(err);
                    else {
                        const correctDate = data.exif.DateTimeOriginal.slice(0, 10).split(':');
                        const dirForPhotos = await mkDirs(correctDate, photosDir);

                        await moveImage(imageToRead, `${dirForPhotos}/${path}`);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    });
};
