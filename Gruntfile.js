
var fs = require('fs'),
    _ = require('underscore');

// The transforms that our Browserification will make use of
var TRANSFORMS = [
    ['babelify', {
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties']
    }]
];

// Show the un-minified prelude text
var preludeText;
try {
    preludeText = fs.readFileSync(require.resolve('browser-pack/prelude'), { encoding: 'utf8' });
} catch (e) {}


module.exports = function (grunt) {
    var target = {
        'build/index.js': 'src/client/index.jsx'
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            // Production Browserify config.
            dist: {
                files: target,
                options: {
                    transform: TRANSFORMS,
                    browserifyOptions: {
                        prelude: preludeText,
                        debug: true
                    }
                }
            },

            // Dev Browserify config. This will watch for changes in the code and
            // auto-rebuild when it observes them.
            watch: {
                files: target,
                options: {
                    transform: TRANSFORMS,
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        prelude: preludeText,
                        debug: true
                    }
                }
            }
        },

        // Extracts source-maps into their own file-- send those bits down the
        // wire only when desired
        exorcise: {
            bundle: {
                options: {},
                files: exorcise(target)
            }
        }
    });

    // Load the plugins for our tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-exorcise');

    // Tasks
    grunt.registerTask('default', ['browserify:dist', 'exorcise']);
    grunt.registerTask('watch', ['browserify:watch']);
};


/**
 * Exorcist is a plugin that can extract the source mappings from Browserify into their own files.
 * This method will produce the config required to run exorcist on the targets we want.
 *
 * @param targets
 */
function exorcise (targets) {
    var unzippedMaps = _.chain(targets)
        .keys()
        .map(exorciseTarget)
        .unzip()
        .value();

    return _.object.apply(_, unzippedMaps);

    /**
     * Creates the path to the source map file given the path to the built file
     *
     * @param {string} builtTarget
     *   The path to the built file
     *
     * @returns {Array}
     */
    function exorciseTarget (builtTarget) {
        return [builtTarget + '.map', builtTarget];
    }
}

