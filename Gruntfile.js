module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Project configuration.
    grunt.initConfig({
        clean: ['target/*'],
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        mochacov: {
            options: {
                reporter: 'xunit',
                /*output: 'target/TEST-xunit.xml'*/
                output: 'target/TEST-xunit.xml'
            },
            all: ['test/**/*.js']
        },
        // start - code coverage settings
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../target/coverage/instrument/'
            }
        },
        instrument: {
            files: 'app/**/*.js',
            options: {
                lazy: true,
                basePath: 'target/coverage/instrument/'
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['app/*'],
                    dest: 'target/coverage/instrument/'
                }]
            }
        },
        storeCoverage: {
            options: {
                dir: 'target/coverage/reports'
            }
        },
        makeReport: {
            src: 'target/coverage/reports/**/*.json',
            options: {
                type: 'html',
                dir: 'target/coverage/reports',
                print: 'detail'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['front/public/app/src/application.js', 'front/public/app/src/config/*.js', 'front/public/app/src/services/*.js', 'front/public/app/src/controllers/*.js'],
                dest: 'front/public/app/app.js'
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['concat']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['env:coverage', 'instrument', 'copy:main', 'mochaTest', 'mochacov', 'storeCoverage', 'makeReport']);
    };