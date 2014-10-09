module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Project configuration.
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['front/public/app/app.js'],
                dest: 'front/public/app/app.js',
            },
        },
    });
    
    // Default task(s).
    grunt.registerTask('default', ['concat']);  
};