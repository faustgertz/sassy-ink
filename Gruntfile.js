module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assemble: {
      options: {partials: 'css/*.css'},
      templates: {
        src: 'templates/**/*.html',
        dest: 'build/downloads',
        cwd: './'
      },
      docsDev: {
        src: 'docs/examples/*.html',
        dest: 'build/docs',
        cwd: './'
      },
      docsDeploy: {
        src: 'docs/examples/*.html',
        dest: 'build',
        cwd: './'
      }
    },
    shell: {
      makeStage: {
        command: [
          'rm -rf build',
          'mkdir build',
          'mkdir build/downloads',
          'mkdir build/downloads/templates',
          'mkdir build/downloads/framework',
          'mkdir build/docs',
        ].join('&&')
      },
      zipTemplates: {
        command: [
          'cd build/downloads/templates/base',
          'cp * ../',
          'cd ../',
          'rm -rf base',
          'zip all-templates.zip *.html',
          'for i in *.html; do zip "${i%}.zip" "$i"; done',
          'cd ../../../'
        ].join('&&')
      },
      zipFramework: {
        command: [
          'cp css/ink.css build/downloads/framework/ink.css',
          'cp templates/boilerplate.html build/downloads/framework/boilerplate.html',
          'cp -r build/downloads/templates/examples build/downloads/framework/examples',
          'cd build/downloads/framework',
          'zip -r ink-<%= pkg.version %>.zip *',
          'cd ../../../',
        ].join('&&')
      },
      linkFramework: {
        command: [
          'cd build/downloads',
          'echo \'<?php $download_file = \"framework/ink-<%= pkg.version %>.zip\" ?>\' > latest.php',
          'cd ../../',
        ].join('&&')
      },
      deployDownloads: {
        command: [
          'cd build/downloads',
          'rsync -r . ink@zurb.com:/var/www/ink/shared/downloads',
          'cd ../../'
        ].join('&&')
      },
      testDocs: {
        command: [
          'cp -r docs/test/* build/docs',
          'cp -r docs/components build/docs/components',
          'cp docs/docs.php build/docs/docs.php',
        ].join('&&')
      },
      deployDocs: {
        command: [
          'rsync -r docs build --exclude test --exclude examples',
          'cd build/docs',
          'rsync -r . ink@zurb.com:/var/www/ink/shared/docs',
          'cd ../../'
        ].join('&&')
      },
      cleanUp: {
        command: [
          'rm -rf build',
          'echo "Deploy Completed"'
        ].join('&&')
      },      
    },
    watch: {
      docs: {
        files: ['docs/docs.php', 'docs/**/*.php', 'docs/**/*.html', 'css/*.css'],
        tasks: ['shell:makeStage', 'assemble:docsDev', 'shell:testDocs'],
        options: {
          livereload: true,
        },
      },
      sassTest: {
        files: ['scss/*.scss', 'scss/ink/*.scss', 'scss/ink/components/*.scss'],
        tasks: ['sass:test', 'exec:sassTestDiff'],
      },
      sassWatch: {
        files: ['scss/*.scss', 'scss/ink/*.scss', 'scss/ink/components/*.scss'],
        tasks: ['sass:test', 'copy:sassTest2Dist', 'exec:sassTestDiff'],
      }      
    },


    clean: {
      sassCss: ["css"],
      sassTest: ["test/results"],
    },
    copy: {
      sassDeploy: {
        src: 'scss/**',
        dest: 'build/downloads/framework/',
      },
      sassTest2Dist: {
        src: 'test/results/ink.css',
        dest: 'css/ink.css',
      }, 

    },
    sass: {
      options: {
        style: 'expanded',
        precision: 6
      },
      dist: {
        files: {
          'css/ink.css': 'scss/ink.scss'
        },
      },
      dev: {
        files: {
          'css/ink.css': 'scss/ink.scss'
        },
      },      
      test: {
        files: {
          'test/results/ink.css': 'scss/ink.scss',
        },
      },
      testTarget: {
        files: {
          'test/results/target.css': 'test/fixtures/ink.css'
        },
      }, 
    },
    "regex-replace": {
      sassPrepTestTarget: {
        src: ['test/results/target.css'],
        actions: [
          {
            name: 'Remove annoying linebreak difference',
            search: /(table\[class="body"\] td\.offset\-by\-)(\w+)\s*?(,?\s*)(?=\1\w+)/g,
            replace: '$1$2, ',
          },
          {
            name: 'Change filename of sourcemap to \'ink\' to pass the diff test',
            search: /(\/\*# sourceMappingURL=)(\w+)(\.css\.map)/,
            replace: '$1ink$3',
          },
        ],
      }
    },
    exec: {
      sassTestDiff: {
        command: [
         'diff -bB --brief test/results/target.css test/results/ink.css',
          ';',        
          'diff -bB test/results/target.css test/results/ink.css > test/results/diff.txt',
          ';',
         'diff -bBs test/results/target.css test/results/ink.css',
          '&&',
          'rm test/results/diff.txt',
        ].join(''),
        exitCode: [0],
      }, 
    },    
  });

  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  grunt.registerTask('make:templates', ['assemble:templates', 'shell:zipTemplates']);
  grunt.registerTask('deploy:downloads', ['shell:makeStage', 'assemble:templates', 'shell:zipTemplates', 'shell:zipFramework', 'shell:linkFramework', 'shell:deployDownloads', 'shell:cleanUp']);
  grunt.registerTask('make:docs', ['shell:makeStage', 'assemble:docsDev', 'shell:testDocs']);
  grunt.registerTask('deploy:docs', ['shell:makeStage', 'assemble:docsDeploy', 'shell:deployDocs', 'shell:cleanUp']);
  grunt.registerTask('default', ['make:docs', 'watch:docs']);

  grunt.registerTask('sassy:clean', ['clean:sassCss', 'clean:sassTest']);
  grunt.registerTask('sassy:test:clean', ['clean:sassTest']);
  grunt.registerTask('sassy:test:target', ['newer:sass:testTarget']);
  grunt.registerTask('sassy:test:init', ['sassy:test:clean', 'sassy:test:target']);
  grunt.registerTask('sassy:test:sass', ['sass:test', 'regex-replace:sassPrepTestTarget', 'exec:sassTestDiff']);
  grunt.registerTask('sassy:test', ['sassy:test:target', 'sassy:test:sass']);
  grunt.registerTask('sassy:test:watch', ['sassy:test', 'watch:sassTest']);
  grunt.registerTask('sassy:make', ['sass:dev']);
  grunt.registerTask('sassy', ['sassy:clean', 'sassy:test', 'copy:sassTest2Dist', 'watch:sassWatch']);

  grunt.registerTask('sassy:make:templates', ['sass:dist', 'make:templates']);
  grunt.registerTask('sassy:deploy:downloads', ['shell:makeStage', 'sass:dist', 'copy:sassDeploy', 'assemble:templates', 'shell:zipTemplates', 'shell:zipFramework', 'shell:linkFramework', 'shell:deployDownloads', 'shell:cleanUp']);
  grunt.registerTask('sassy:make:docs', ['sass:dist', 'make:docs']);
  grunt.registerTask('sassy:deploy:docs', ['sass:dist', 'deploy:docs']);
  grunt.registerTask('sassy:default', ['sass:dist', 'default']);



};