import { promisify } from 'util';
import { readdir } from 'fs';

import ExifImage from 'exif';
import mkdirp from 'mkdirp';
import mv from 'mv';

const readDirAsync = promisify(readdir);

const args = process.argv;
const directoryToRead = args[2];

const moveFile = (file, dir) => {
    mv(file, dir, err => {
        if (err) {
            console.log(err);
            return;
        };

        console.log(`${file} moved!`);
    });
};

const mkDir = (correctDate, callback) => {
    const yearDir = `${directoryToRead}/${correctDate[0]}`;
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
    const dirContents = await readDirAsync(directoryToRead);

    dirContents.forEach(path => {
        const imageToRead = `${directoryToRead}/${path}`;

        try {
            new ExifImage({ image: imageToRead }, async (err, data) => {
                if (err) console.log(err);
                else {
                    const correctDate = data.exif.DateTimeOriginal.slice(0, 10).split(':');
                    const dirForPhotos = await mkDir(correctDate);

                    moveFile(imageToRead, `${dirForPhotos}/${path}`);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
})();
