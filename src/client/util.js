
import _ from 'underscore';


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
        // Basic interpolation helper
        function transition (value, maximum, start_point, end_point) {
            return Math.round(start_point + (end_point - start_point) * value / maximum);
        }

        function transitionRGB (value, maximum, rgb1, rgb2) {
            return {
                r: transition(value, maximum, rgb1.r, rgb2.r),
                g: transition(value, maximum, rgb1.g, rgb2.g),
                b: transition(value, maximum, rgb1.b, rgb2.b)
            };
        }

        let green = { r:  20, g: 140, b: 20 },
            red   = { r: 255, g:  80, b: 80 },
            rgb   = transitionRGB(Util.percentFunded(project), 100, red, green);

        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
};


export default Util;