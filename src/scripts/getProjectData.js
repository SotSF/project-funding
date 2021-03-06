
var GoogleSpreadsheet = require('google-spreadsheet'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path');

var PROJECT_ROOT = path.resolve(__dirname, '../../');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('13xzXDcuJtIOh7PwYa2rF-SrdVTNh8942tOlokb64NDM');

async.series([
    function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('../../config/google-generated-creds.json');
        doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
            var crowd_funding_ws = _.findWhere(info.worksheets, { title: 'Crowd Funding' });
            crowd_funding_ws.getCells({
                'min-row': 2,
                'max-row': 100,
                'min-col': 1,
                'max-col': 51
            }, function (err, cells) {
                getProjects(cells);
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

    // We don't care about rows 13-23, they will not be used
    cells = _.filter(cells, function (cell) {
        return cell.row < 13 || cell.row > 23;
    });

    var headers = getHeaders(cells);
    var projectData = _.map(projectCols, function (projectCol) {
        return extractProjectDataFromCol(projectCol, headers, cells);
    });

    var dataPath = path.resolve(PROJECT_ROOT, 'data/projectData.json');
    jsonfile.writeFileSync(dataPath, projectData, { spaces: 4 });
}


function getHeaders(cells) {
    return _.where(cells, { col: 1 });
}


function extractProjectDataFromCol(col, headers, cells) {
    var projectData = _.filter(cells, function (cell) {
        return (cell.col === col || cell.col === col + 1) && cell.row >= 2;
    });

    var projectName;
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

    var projectJson = _.object(_.pluck(headers, '_value'), headerData);
    projectJson['Image URL'] = getProjectImage(projectName);
    projectJson['Expenditures'] = getProjectExpenditures(projectData);

    return projectJson;
}


function getProjectImage (projectName) {
    // If there's a URL provided, go get it
    projectName = projectName.replace('/', '-');
    var imageRelativePath = 'static/img/projects/' + projectName + '.jpg';
    var imagePath = path.resolve(PROJECT_ROOT, imageRelativePath);

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


function getProjectExpenditures (projectData) {
    var expendituresStartRow = 32,
        itemCol = _.findWhere(projectData, { row: 31, _value: 'Item' }).col,
        costCol = _.findWhere(projectData, { row: 31, _value: 'Cost' }).col;

    return _.chain(projectData)
        .filter(function (cell) {
            return cell.row >= expendituresStartRow;
        })
        .groupBy('row')
        .map(function (row) {
            var itemCell = _.findWhere(row, { col: itemCol }),
                costCell = _.findWhere(row, { col: costCol });

            // If there's no item listed, just ditch it
            if (!itemCell) {
                return null;
            }

            return {
                item: itemCell._value,
                cost: parseCost(costCell)
            };
        })

        // Remove any null-rows that didn't have an item column
        .filter(_.identity)
        .value();

    function parseCost (costCell) {
        if (!costCell) return null;

        var cost = costCell._value.trim();
        if (cost[0] === '$') {
            return parseFloat(cost.slice(1));
        } else if (!_.isNaN(parseFloat(cost))) {
            return parseFloat(cost);
        } else {
            return null;
        }
    }
}
