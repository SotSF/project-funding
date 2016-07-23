
var GoogleSpreadsheet = require('google-spreadsheet'),
    async = require('async'),
    _ = require('underscore'),
    jsonfile = require('jsonfile'),
    path = require('path');

var PROJECT_ROOT = path.resolve(__dirname, '../../');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('13xzXDcuJtIOh7PwYa2rF-SrdVTNh8942tOlokb64NDM');

async.series([
    function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('../../google-generated-creds.json');
        doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
            var crowd_funding_ws = _.findWhere(info.worksheets, { title: 'Crowd Funding' });
            crowd_funding_ws.getCells({
                'min-row': 2,
                'max-row': 13,
                'min-col': 1,
                'max-col': 41
            }, function (err, cells) {

                var columns = getProjects(cells);
            });
        });
    }
], function (err) { console.log(err); });


function getProjects(cells) {
    var maxRowLength = _.max(_.pluck(cells, 'col'));
    var projectCols = _.filter(_.range(1, maxRowLength + 1), function (colNum) {
        if (colNum === 1) return false;
        return _.findWhere(cells, { row: 2, col: colNum });
    });

    var headers = getHeaders(cells);
    var projectData = _.map(projectCols, function (projectCol) {
        return extractProjectDataFromCol(projectCol, headers, cells);
    });

    var dataPath = path.resolve(PROJECT_ROOT, 'projectData.json');
    jsonfile.writeFileSync(dataPath, projectData, { spaces: 4 });
}


function getHeaders(cells) {
    return _.where(cells, { col: 1 });
}


function extractProjectDataFromCol(col, headers, cells) {
    var projectData = _.filter(cells, function (cell) {
        return (cell.col === col || cell.col === col + 1) && cell.row >= 2;
    });

    let projectName;
    var headerData = _.map(headers, function (header) {
        var values = _.pluck(_.where(projectData, { row: header.row }), '_value');

        switch (header._value) {
            case 'Project':
                projectName = values[0];
                break;
            case 'Image URL':
                return getProjectImage(values[0], projectName);
        }

        return values.length === 1 ? values[0] : values;
    });

    return _.object(_.pluck(headers, '_value'), headerData);
}


function getProjectImage (url, projectName) {
    // If there's a URL provided, go get it
    var imageRelativePath = 'static/img/' + projectName + '.jpg';
    var imagePath = path.resolve(PROJECT_ROOT, imageRelativePath);
    if (url) {
        download(url, imagePath, function () {
            console.log('Fetched image for project ' + projectName);
        });
        return imageRelativePath;
    }
    
    // If there's already a file at that location, we're good
    try {
        fs.statSync(imagePath, fs.F_OK);
        return imageRelativePath;
    } catch (e) {
        // Otherwise there's no file and no URL. Return `null`
        console.log('no url, no image: ' + projectName);
        return null;
    }
}


var fs = require('fs'),
    request = require('request');

function download (uri, filename, callback){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
}