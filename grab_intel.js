//
// This will expand the list to the maximum size.
//
window.count = 0;
function expandList() {
    try {
        $('.pager').get(0).click();
        const new_time = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        console.log('Waiting for ' + new_time + ' ms with a count of ' + window.count);
        window.count += 10;
        setTimeout(expandList, new_time);
    } catch (err) {
        console.log('Finished');
        grabItem();
        return;
    }
}

function errorHandler(err) {
    console.log('Error was:  ' + err);
}

async function appendText(fs, file_name, blob) {
    fs.root.getFile('titan_intel', {create: true}, function (fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            // Append
            fileWriter.seek(fileWriter.length);
            fileWriter.write(blob);
        }, errorHandler);
    });
}

function initFS(fs) {
    window.fs = fs;
    // appendText(fs, fileName, window.lines)
}

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.webkitStorageInfo.requestQuota(
    PERSISTENT, 
    10000 * 1024 * 1024,
    function (grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, initFS, errorHandler);
    },
    function (err) {
        console.log('Error requesting quota was:  ' + err);
    }
);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getText() {
    const text = $('.textBox').text();

    return text;
}

//
// This will get all Entities from the page.
//
async function getElements() {
    let elements = '';
    // Cannot use short arrow functions in jQuery.
    $('dd').each( function(index) {
        elements += $(this).text() + '\n';
    });

    return elements;
}

async function logReport(index, summary, path_name, link) {
    //
    // We have seen "undefined" links in the field.
    // It seems to continue churning normally.
    //
    /*if (link === undefined) {
        // What do we do?
        return;
    }*/
    $('.listItem').get(index).click();
    console.log('Clicking link ' + link);
    await sleep(7000);
    let text = await getText();
    let entities = await getElements();
    console.log('Got info...');

    summary = '##SUMMARY##' + summary + '**SUMMARY**';
    link = '##LINK##' + link + '**LINK**';
    text = '##TEXT##' + text + '**TEXT**';
    entities = '##ENTITIES##' + entities + '**ENTITIES**';

    const body = summary + link + text + entities;

    const new_data = new Blob([body], {type: 'text/plain'});
    await appendText(window.fs, path_name, new_data);

    // await sleep(3000);
    window.history.back();
    await sleep(2500);

    return;
}

async function grabItem() {
    // So apparently this is synchronous.
    var items = $('.listItem');
    //
    // We do not want SPOTREP on the div class "infoPanel" with span attribute type.
    //
    for (var index = 0; index < items.length; index++) {
        // this.href has the link to the main report
        // this.innerText has the good stuff we need for a summary.
        const current_element = $('.listItem').get(index);
        if (current_element.type == 'SPOTREP') {
            // console.log('Skipping spot report');
            // continue;
        }
        const summary = $('.listItem').get(index).innerText;
        const link_to_summary = $('.listItem').get(index).href;
        // Get hash from path as filename.
        const path_name = 'unused';
        /*try {
            const path_name = $('.listItem').get(index).pathname.split('/').pop();
        } catch (err) {
            const path_name = '';
        }*/

        await logReport(index, summary, path_name, link_to_summary);
    }
}

expandList();
// grabItem();