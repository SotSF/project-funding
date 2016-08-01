
import _ from 'underscore';
import xhr from 'tiny-xhr';


/**
 * Bundle of utility functions. This should probably be restructured into a class wrapping our
 * project data
 */
const Util = {
    stats: (project) => {
        function parseMoney (value) {
            if (value === void 0) {
                return null;
            } else if (value[0] === '$') {
                return parseFloat(value.slice(1));
            } else if (_.isNaN(parseFloat(value))) {
                return null;
            } else {
                return parseFloat(value);
            }
        }

        return {
            goal   : parseMoney(project['Project Goal']),
            raised : parseMoney(project['Raised Total'][0])
        }
    },

    percentFunded: (project) => {
        let stats = Util.stats(project),
            percent = stats.raised / stats.goal * 100;
        return _.isNaN(percent) ? 100 : percent;
    },

    progressColor: (project) => {
        return redToGreen(Util.percentFunded(project), 100);
    }
};


let redToGreen = (value, maximum) => {
    // Basic interpolation helper
    function transition (value, start_point, end_point) {
        let proportion = Math.round(start_point + (end_point - start_point) * value / maximum);
        if (proportion > maximum) return maximum;
        return proportion;
    }

    function transitionRGB (value, rgb1, rgb2) {
        return {
            r: transition(value, rgb1.r, rgb2.r),
            g: transition(value, rgb1.g, rgb2.g),
            b: transition(value, rgb1.b, rgb2.b)
        };
    }

    let green = { r:  20, g: 140, b: 20 },
        red   = { r: 255, g:  80, b: 80 },
        rgb   = transitionRGB(value, red, green);

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};


/**
 * Uses jQuery to fetch the resource specified by a given URI, and then remembers the result so that
 * subsequent requests with the same URI need not happen again
 *
 * @param {string} uri
 *   The URI to query
 *
 */
let getOnce = (() => {
    // The remember-er
    let memory = new Map();

    return uri => {
        if (uri in memory) {
            return new Promise(resolve => resolve(memory[ui]));
        }

        return xhr({
            url: uri,
            method: 'GET',
            type: 'json',
            data: 'data',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => memory[uri] = response);
    }
})();


export default Util;
export { getOnce, redToGreen };
