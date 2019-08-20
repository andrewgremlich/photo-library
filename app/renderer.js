const { readdir } = require('fs');
const { dialog } = require('electron').remote;

const { query } = require('./scripts/lib/index.js');

const photoDirLabel = query('[for="photoDirectory"]');
const photoDir = query('#photoDirectory');
const photoOutput = query('#photoOutput');

if (localStorage['photosDirectory']) {
    photoDirLabel.innerHTML = localStorage['photosDirectory'];
}

photoDir.addEventListener('click', async () => {
    try {
        const { filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        localStorage['photosDirectory'] = filePaths[0];

        photosDir = filePaths[0];
    } catch (err) {
        console.error(err);
    }
});

photoOutput.addEventListener('click', evt => {
    readdir(localStorage['photosDirectory'], (err, data) => {
        console.log(data);
    });
});
