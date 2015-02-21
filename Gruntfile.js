module.exports = function (grunt) {
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    var mozjpeg = require('imagemin-mozjpeg');

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
            all: ['test/*.js', 'test/app/**/*.js']
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
        imagemin: {
            static: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: {
                    'target/b2b/front/public/images/bar-location.png': 'front/public/images/bar-location.png',
                    'target/b2b/front/public/images/charmant.jpg': 'front/public/images/charmant.jpg',
                    'target/b2b/front/public/images/choose_1.jpg': 'front/public/images/choose_1.jpg',
                    'target/b2b/front/public/images/community.jpg': 'front/public/images/community.jpg',
                    'target/b2b/front/public/images/compass.png': 'front/public/images/compass.png',
                    'target/b2b/front/public/images/favicon.ico': 'front/public/images/favicon.ico',
                    'target/b2b/front/public/images/fruits.jpeg': 'front/public/images/fruits.jpeg',
                    'target/b2b/front/public/images/holliday.jpg': 'front/public/images/holliday.jpg',
                    'target/b2b/front/public/images/jedi1.jpg': 'front/public/images/jedi1.jpg',
                    'target/b2b/front/public/images/team.jpg': 'front/public/images/team.jpg',
                    'target/b2b/front/public/images/white.jpg': 'front/public/images/white.jpg',
                    'target/b2b/front/public/images/home.png': 'front/public/images/home.png',
                    'target/b2b/front/public/images/logo.png': 'front/public/images/logo.png',
                    'target/b2b/front/public/images/search.png': 'front/public/images/search.png',
                    'target/b2b/front/public/images/sso.png': 'front/public/images/sso.png',
                    'target/b2b/front/public/images/sport.jpeg': 'front/public/images/sport.jpeg',
                    'target/b2b/front/public/images/love.jpeg': 'front/public/images/love.jpeg'
                }
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
                        src: ['front/public/app/src/i18n/**'],
                        dest: 'target/b2b/'
                    }, {
                        expand: true,
                        cwd: 'front/public/libs/bootstrap/',
                        src: ['fonts/**'],
                        dest: 'target/b2b/front/public/'
                    },{
                        expand: true,
                        cwd: 'front/public/libs/components-font-awesome/',
                        src: ['fonts/**'],
                        dest: 'target/b2b/front/public/'
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
        ngAnnotate: {
            b2b: {
                files: [
                    {
                        expand: true,
                        src: ['front/public/app/src/*.js']
                    },
                    {
                        expand: true,
                        src: ['front/public/app/src/controllers/*.js']
                    }
                ]
            }
        },
        jadeUsemin: {
            scripts: {
                options: {
                    tasks: {
                        js: ['concat', 'uglify'],
                        css: ['concat', 'cssmin']
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
    grunt.registerTask('buildApp', ['clean', 'ngAnnotate', 'copy:sources', 'jadeUsemin','imagemin']);
    grunt.registerTask('heroku:production', ['clean', 'copy:sources', 'jadeUsemin']);
};