module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Project configuration.
    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
          test: {
            options: {
              reporter: 'spec'
            },
            src: ['test/server/**/*.js']
          }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['front/public/app/src/application.js','front/public/app/src/services/*.js', 'front/public/app/src/controllers/*.js'],
                dest: 'front/public/app/app.js'
            }
        }
    });
    
    // Default task(s).
    grunt.registerTask('default', ['concat']);
    grunt.registerTask('test', ['mochaTest']);  
};