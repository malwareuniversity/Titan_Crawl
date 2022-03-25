$('.iStatBlock').each(function(index, value) {
    const stat_box = $(this).attr('.iStatBox');
	if (stat_box !== undefined) {
		console.log(index + ': ' + stat_box);
		const lamp = $(stat_box).children('h3').children('span.lamp').outerText;
		if (lamp !== undefined) {
			console.log(lamp);
        } 
    }
});




$(stat_box).find('.iStatBlock h3').text()


//
// Sadly this script loses context of both jQuery and itself after the "click"
// to a new page.
//
let results = new Array();
let element = new Object();
let count = 0;

let global_results = new Array();
let loop = true;

while (loop) {
    // Get each motivation
    $('.iStatBox > h3 > span').each(function(index, value) {
        console.log(this.outerText);
        element['motivation'] = this.outerText;
        results[index] = element;
    });

    // Get each URL
    $('.iStatBox > p > span').each(function(index, value) {
        
        console.log(this.outerText);
        element['URL'] = this.outerText;
        results[index]['URL'] = this.outerText;
        global_results.push(results[index]);
    });

    if ($('.next').length !== 0) 
        $('.next')[0].click();
    else loop = false;
}

localStorage.setItem('results', global_results);






let results = new Array();
let element = new Object();
let count = 0;

let global_results = new Array();
if (localStorage.getItem('results') !== null) {
    global_results = JSON.parse(localStorage.getItem('results'));
}

let loop = true;

// Get each motivation
$('.iStatBox > h3 > span').each(function(index, value) {
    console.log(this.outerText);
    element['motivation'] = this.outerText;
    results[index] = element;
});

// Get each URL
$('.iStatBox > p > span').each(function(index, value) {
    
    console.log(this.outerText);
    element['URL'] = this.outerText;
    results[index]['URL'] = this.outerText;
    global_results.push(results[index]);
});

localStorage.setItem('results', JSON.stringify(global_results));





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
    let count = 0;

    let global_results = new Array();
    if (localStorage.getItem('results') !== null) {
        global_results = JSON.parse(localStorage.getItem('results'));
    }

    let loop = true;

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
        // lines[index] = motivation[index] + ' ' + url[index];
        lines += motivation[index] + ' ' + url[index] + '\n';
        // console.log(lines[index]);
    });
    console.log('END_HERE');

    debugger;
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

console.log('About to sleep...');
sleep(5000).then(() => {
    doStuff();
});
console.log('Slept');
// setTimeout(5000, doStuff());
//window.addEventListener('load', doStuff);

/*window.addEventListener('DOMContentLoaded', (event) => {
    doStuff();
});*/
