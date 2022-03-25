function errorHandler(err) {
    console.log('Error was:  ' + err);
}


function appendText(fs, filePath, blob) {
    fs.root.getFile('titan.txt', {create: true}, function (fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            // Append
            fileWriter.seek(fileWriter.length);
            fileWriter.write(blob);
        }, errorHandler);
    }, errorHandler);
}


function initFS(fs) {
    console.log('Opened file system: ' + fs.name);
    appendText(fs, 'titan.txt', window.lines);
}



function doStuff() {
    let motivation = new Array();
    let url = new Array();
    //let lines = new Array();
    let lines = '';

    if (localStorage.getItem('results') !== null) {
        global_results = JSON.parse(localStorage.getItem('results'));
    }

    // Get each motivation
    $('.iStatBox > h3 > span').each(function(index, value) {
        motivation[index] = this.outerText
    });

    // Get each URL
    $('.iStatBox > p > span').each(function(index, value) {
        url[index] = this.outerText;
    });

    console.log('CUT_HERE');
    motivation.forEach(function(value, index) {
        lines += motivation[index] + ' ' + url[index] + '\n';
    });
    console.log('END_HERE');

    // debugger;
    window.lines = new Blob([lines], {type: 'text/plain'});

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(
        PERSISTENT, 
        1024 * 1024,
        function (grantedBytes) {
            window.requestFileSystem(PERSISTENT, grantedBytes, initFS, errorHandler);
        },
        function (err) {
            console.log('Error requesting quota was:  ' + err);
        }
    );
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//
// We need to wait for the page to load if we are using an auto-loader like Custom Javascript extension
// 
sleep(5000).then(() => {
    doStuff();
});
