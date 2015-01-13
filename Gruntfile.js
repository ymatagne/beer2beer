module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-jade-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Project configuration.
    grunt.initConfig({
        clean: ['target/*'],
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/app/**/*.js']
            }
        },
        mochacov: {
            options: {
                reporter: 'xunit',
                output: 'target/TEST-xunit.xml'
            },
            all: ['test/*.js','test/app/**/*.js']
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
            sources: {
                files: [{
                    expand: true,
                    src: ['app/**'],
                    dest: 'target/b2b/'
                },
                {
                    expand: true,
                    src: ['front/views/**'],
                    dest: 'target/b2b/'  
                },
                {
                    expand: true,
                    src: ['front/public/css/**'],
                    dest: 'target/b2b/'  
                },
                {
                    expand: true,
                    src: ['front/public/images/**'],
                    dest: 'target/b2b/'  
                },
                {
                    expand: true,
                    src: ['front/public/libs/**'],
                    dest: 'target/b2b/'  
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
                type: ['html', 'lcov'],
                dir: 'target/coverage/reports',
                print: 'detail'
            }
        },
        jadeUsemin: {
            scripts: {
                options: {
                    tasks: {
                        js: ['concat']
                    },
                    prefix: 'front/public/',
                    targetPrefix: 'target/b2b/front/public/'
                },
                files: [{
                    dest: 'target/b2b/front/views/layout/_layout.jade',
                    src: 'front/views/layout/_layout.jade'
                }]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3001,
                    base: 'target/b2b',
                    keepalive: true
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['clean', 'coverage', 'buildApp']);
    grunt.registerTask('test', ['mochaTest', 'karma']);
    grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest', 'mochacov', 'storeCoverage', 'makeReport', 'karma']);
    grunt.registerTask('buildApp', ['copy:sources', 'jadeUsemin']);
    grunt.registerTask('heroku:production', ['clean','copy:sources', 'jadeUsemin']);
    };