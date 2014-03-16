# Wearscript Playground #
<http://github.com/OpenShades/wearscript-playground>

## About ##
The web-based IDE for WearScript. Write code, pair glass, save, and enjoy.

## Requirements ##

  * nodejs <https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager>
  * redis <http://redis.io/topics/quickstart>
  * go <http://golang.org/doc/install>
  * Google OAuth API Credentials <https://console.developers.google.com/project>

## Development ##

### Initial Setup ###

  1. Clone repo and submodules

    ```bash
    git clone git@github.com:OpenShades/wearscript-playground.git
    cd wearscript-playground
    git submodule update --init
    ```
  2. Configure API server

    ```bash
    cp server/config.go.example server/config.go
    ```

    Edit server/config.go to be in single user mode.

  3. Compile API Server (requires a working Go environment)

    ```bash
    mkdir $HOME/go
    cd server
    sh install.sh
    cd ..
    ```

  2. Install CLI tools

    ```bash
    sudo npm install -g grunt-cli grunt bower yo generator-angular
    ```
  3. Install client and grunt build dependencies

    ```bash
    bower install
    npm install
    ```

  4. Find and install an 'editorconfig' plugin in your IDE of choice

    Optional but reccommended for code consistancy.

    See: <http://editorconfig.org/#download>

### Building ###

  1. Install latest dependencies (if *.json files have changed)

    ```bash
    bower install
    npm install
    ```
  2. Compile

    ```bash
    grunt build
    ```
Built version of application will be availible in the 'dist' directory.

### Serving ###

To serve live uncompressed tree with live-reload on change:

```bash
grunt serve
```

To serve live compiled version:

```bash
grunt serve:dist
```
By default application will be accessible at <http://YOUR_IP:9000>


### Extending ###

This setup is compatable with the yo angular generator.

You can use any "yo angular" commands to generate boilerplate complete with
tests relevant to extension you want to make. You can of course just write
anything by hand and these are only here as optional helpers.

Some common commands:

```bash
# Route
yo angular:route someroute

# Controller
yo angular:controller controllerName

# Directive
yo angular:directive directiveName

# Service
yo angular:service serviceName

# View
yo angular:view someview

```
### Dependency Management ###

In order to manage third party open source dependencies and ensure
compatibility and cross-dependency sanity, please use package managers.

As a general rule of thumb, if it is code you did not write and your project
needs it, it probably should be handeled by a package manager and not committed 
to the repo. It also makes sure the git-stats are accurate which is valuable
to track team progress.

To add a client-side javascript dependency do:

```bash
bower install some-awesome-library --save
```
This will update the 'bower.json' file and ensure other developers install this
as well. It will also make best efforts to install a version of a library that
is compatible with existing libraries being used in the project.

### Testing ###

To run all current tests:

```bash
grunt test
```
## Further Reading ##

[AngularJS Docs](http://docs.angularjs.org/api)

[AngularJS Book](http://shop.oreilly.com/product/0636920028055.do)

[AngularJS Style Guide](https://github.com/mgechev/angularjs-style-guide)

[Angular Yo Generator Docs](https://github.com/yeoman/generator-angular)

[Grunt Docs](http://gruntjs.com/getting-started)

[Bower Docs](https://github.com/bower/bower)
