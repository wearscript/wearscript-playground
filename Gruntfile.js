'use strict';
module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Explicitly host on local ip unless --host defined
  var os=require('os');
  var ifaces=os.networkInterfaces();
  var lookupIpAddress = null;
  for (var dev in ifaces) {
      ifaces[dev].forEach(function(details){
        console.log(details)
        if (details.family=='IPv4') {
          lookupIpAddress = details.address;
        }
      });
  }
  var ipAddress = grunt.option('host') || lookupIpAddress;

  var middleware = function (connect, options) {
      if (!Array.isArray(options.base)) {
        options.base = [options.base];
      }

      // Setup the proxy
      var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

      // Serve static files.
      options.base.forEach(function(base) {
          middlewares.push(connect.static(base));
      });

      // Make directory browse-able.
      var directory = options.directory || options.base[options.base.length - 1];
      middlewares.push(connect.directory(directory));

      return middlewares;
    }

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      less: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
        tasks: ['less:dev'],
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.less',
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['less']
      }
    },
    exec: {
      'api-build': 'cd server; go build && cd ..',
      'api-serve': 'killall server; cd server; ./server &',
      'webdriver-manager': './node_modules/protractor/bin/webdriver-manager update && cp node_modules/protractor/selenium/selenium-*.jar test/e2e/selenium.jar'
    },
    protractor:
      { options:
        { keepAlive: true
        , noColor: false
        }
      , chrome:
        { options:
          { configFile: "test/e2e/config/chrome.js"
          }
        }
      , phantom:
        { options:
          { configFile: "test/e2e/config/phantomjs.js"
          }
        }
      },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9888,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729

      },
      proxies: [
        { context:
            [ '/auth'
            , '/ws'
            , '/example'
            , '/oauth2callback'
            , '/user'
            , '/oauth2callbackgh'
            , '/authgh'
            ]
        , host: 'localhost'
        , port: 4938
        , https: false
        , changeOrigin: false
        , xforward: false
        , timeout: 9999999999999999
        , ws: true
        }
      ],
      livereload: {
        options:
          { open: 'http://' + ipAddress + ':9888'
          , base:
            [ '.tmp'
            , '<%= yeoman.app %>'
            ]
          ,  middleware: middleware
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>',
          middleware: middleware
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Compile less stylesheets
    less: {
      dev: {
        options: {
          paths: ['<%= yeoman.app %>/styles'],
          ieCompat: false
        },
        files: {
          ".tmp/styles/main.css": "<%= yeoman.app %>/styles/main.less"
        }
      },
      dist: {
        options: {
          paths: ['<%= yeoman.app %>/styles'],
          ieCompat: false
        },
        files: {
          "<%= yeoman.dist %>/styles/main.css": "<%= yeoman.app %>/styles/main.less"
        }
      }
    },

    uglify: {
      dist:{
        options : {
          sourceMap: '<%= yeoman.dist %>/scripts/scripts.map.js',
          sourceMapRoot: '/',
          mangle: false,
          report: 'min',
          beautify: {
            beautify      : false,   //  beautify output?
            indent_level  : 4,      //  indentation level (only when `beautify`)
            indent_start  : 0,      //  start indentation on every line (only when `beautify`)
            quote_keys    : true,   //  quote all keys in object literals?
            space_colon   : true,   //  add a space after colon signs?
            ascii_only    : true,   //  output ASCII-safe? (encodes Unicode characters as ASCII)
            inline_script : true,   //  escape "</script"?
            width         : 80,     //  informative maximum line width (for beautified output)
            max_line_len  : 32000,  //  maximum line length (for non-beautified output)
            bracketize    : true,   //  use brackets every time?
            semicolons    : true,   //  use semicolons to separate statements? (otherwise newlines)
            comments      : false,   //  output comments?
          },
          compress: {
            sequences     : true, // join consecutive statemets with the 'comma operator'
            properties    : true, // optimize property access: a["foo"] -> a.foo
            dead_code     : true, // discard unreachable code
            drop_debugger : true, // discard 'debugger' statements
            unsafe        : true, // some unsafe optimizations (see docs)
            conditionals  : true, // optimize if-s and conditional expressions
            comparisons   : true, // optimize comparisons
            evaluate      : true, // evaluate constant expressions
            booleans      : true, // optimize boolean expressions
            loops         : true, // optimize loops
            unused        : true, // drop unused variables/functions
            hoist_funs    : true, // hoist function declarations
            hoist_vars    : true, // hoist variable declarations
            if_return     : true, // optimize if-s followed by return/continue
            join_vars     : true, // join var declarations
            cascade       : true, // try to cascade `right` into `left` in sequences
            side_effects  : true, // drop side-effect-free statements
            warnings      : true, // warn about potentially dangerous optimizations/code
            global_defs   : {}     // global definitions
          }
        },
        files: {
          '<%= yeoman.dist %>/scripts/scripts.min.js': [
            '.tmp/concat/scripts/vendor.js',
            '.tmp/concat/scripts/scripts.js'
          ]
        }
      }

    },


    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      scripts: {
        expand: true,
        cwd: '.tmp/concat/scripts',
        dest: 'dist/scripts/',
        src: '{,*/}*.js'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css',
      }
    },


    'string-replace': {
      dev: {
        options: {
          replacements: [{
            pattern: '"{{.WSUrl}}"',
            replacement: '"ws://" + location.host'
          }]
        },
        files: {
          '.tmp/index.html': '<%= yeoman.app %>/index.html',
        }
      },
    },


    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'exec:api-serve',
        'configureProxies:server',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'bower-install',
      'less:dev',
      'concurrent:server',
      'exec:api-serve',
      'autoprefixer',
      'configureProxies:server',
      'connect:livereload',
      'string-replace:dev',
      'watch'
    ]);
  });

  grunt.registerTask('test', function(target){
    grunt.task.run(
      [ 'clean:server'
      , 'concurrent:test'
      , 'autoprefixer'
      , 'connect:test'
      ]
    )
    if(target === 'e2e'){
      grunt.task.run(
        [ 'exec:webdriver-manager'
        , 'protractor:chrome'
        //, 'protractor:phantom'
        ]
      )
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'less:dist',
    'cssmin',
    'uglify:dist',
    'copy:scripts',
    //'rev',
    'usemin',
    'htmlmin',
    //'exec:api-build'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
