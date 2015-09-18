module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),
        qunit: {
            files: [ "test/**/*.html" ]
        },
        less: {
            main: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true,
                    sourceMap: false
                },
                files: {
                    "plugin/tooltips.css": "src/tooltips.less"
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            main: {
                files: {
                    "plugin/tooltips.min.css": [ "plugin/tooltips.css" ]
                }
            }
        },
        copy: {
            main: {
                nonull: true,
                expand: true,
                cwd: "src",
                src: "tooltips.js",
                dest: "plugin"
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true,
                    dead_code: true
                },
                exportAll: true,
                preserveComments: false
            },
            main: {
                files: {
                    "plugin/tooltips.min.js": [ "plugin/tooltips.js" ]
                }
            }
        }
    } );

    require( "load-grunt-tasks" )( grunt );

    grunt.registerTask( "build", [ "less", "copy", "cssmin", "uglify" ] );

    // Travis CI task.
    grunt.registerTask( "travis" );
};
