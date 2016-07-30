
var GoogleSpreadsheet = require('google-spreadsheet'),
    async = require('async'),
    _ = require('underscore'),
    jsonfile = require('jsonfile'),
    path = require('path');

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
                'min-row': 13,
                'max-row': 22,
                'min-col': 2,
                'max-col': 52
            }, function (err, cells) {
                getDonors(cells);
            });
        });
    }
], function (err) { console.log(err); });


function getDonors (cells) {
    var donorCombos = getDonorCombos(cells);
    var donationsByName = {};

    _.each(donorCombos, function (combo) {
        var donationVal = parseDonationVal(combo);
        if (donationsByName[combo.donor.name]) {
            if (_.isNull(donationVal)) return;
            donationsByName[combo.donor.name] += donationVal;
        } else {
            donationsByName[combo.donor.name]  = donationVal;
        }
    });

    var dataPath = path.resolve(__dirname, '../../donorData.json');
    console.log(dataPath);
    jsonfile.writeFileSync(dataPath, donationsByName, { spaces: 4 });
}

function getDonorCombos (cells) {
    var donorCombos = [];

    _.each(cells, function (cell) {
        var neighbor = getCellNeighbor(cells, cell);
        if (!neighbor) return;

        var donationRegex = /\$\d+/;
        if (donationRegex.test(cell._value) && !donationRegex.test(neighbor._value)) {
            donorCombos.push({
                value: { val  : cell._value,     row: cell.row,     col: cell.col },
                donor: { name : neighbor._value, row: neighbor.row, col: neighbor.col }
            });
        }
    });

    return donorCombos;
}

function getCellNeighbor (cells, cell) {
    return _.findWhere(cells, { row: cell.row, col: cell.col + 1 });
}

function parseDonationVal (donationCombo) {
    var donationVal = parseFloat(donationCombo.value.val.slice(1));
    var couldNotParseDonationTemplate = _.template('Could not parse donation value (<%= value %>)! See (row <%= row %>, col <%= col %>)');

    if (_.isNaN(donationVal)) {
        console.error(
            couldNotParseDonationTemplate({
                value : donationCombo.value.val,
                row   : donationCombo.value.row,
                col   : donationCombo.value.col
            })
        );

        return null;
    }

    return donationVal
}
