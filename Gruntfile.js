module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Project configuration.
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['front/public/app/src/application.js', 'front/public/app/src/controllers/*.js'],
                dest: 'front/public/app/app.js'
            }
        }
    });
    
    // Default task(s).
    grunt.registerTask('default', ['concat']);  
};