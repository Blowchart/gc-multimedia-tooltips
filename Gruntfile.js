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
                    "plugin/gc-multimedia-tooltips.css": "src/gc-multimedia-tooltips.less"
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            main: {
                files: {
                    "plugin/gc-multimedia-tooltips.min.css": [ "plugin/gc-multimedia-tooltips.css" ]
                }
            }
        },
        copy: {
            main: {
                nonull: true,
                expand: true,
                cwd: "src",
                src: "gc-multimedia-tooltips.js",
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
                    "plugin/gc-multimedia-tooltips.min.js": [ "plugin/gc-multimedia-tooltips.js" ]
                }
            }
        }
    } );

    require( "load-grunt-tasks" )( grunt );

    grunt.registerTask( "build", [ "less", "copy", "cssmin", "uglify" ] );

    // Travis CI task.
    grunt.registerTask( "travis" );
};
