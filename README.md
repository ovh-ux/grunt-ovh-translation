# grunt-ovh-translation

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

> Convert xml translations into JSON key-value


Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

# Example

```javascript
grunt.loadNpmTasks('grunt-ovh-translation');
```

### Configuration
In your project's Gruntfile, add a section named `ovhTranslation` to the data object passed into `grunt.initConfig()`. The options (and defaults) are:

```JavaScript
grunt.initConfig({
  ovhTranslation: {
    dev: {
        files: [
            {
                expand: true,
                flatten: false,
                cwd: 'client',
                src: [
                    'app/**/translations/*.xml',
                    'components/**/translations/*.xml'
                ],
                dest: '.tmp',
                filter: 'isFile',
                extendFrom: ['en_GB', 'fr_FR'],
                lint: true      // [optionnal] set it to false to disable linter
            }
        ]
    }
  },
})
```

## Installation
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

### npm

```
npm install grunt-ovh-translation --save-dev
```

### Get the sources

```
    git clone https://github.com/ovh-ux/grunt-ovh-translation.git
    cd grunt-ovh-translation
    npm install
    bower install
```

### For Windows User
If you get

```shell
Warning: Your translation file must have a linebreak at the end of the file (file: client/app/module-otrs/details/translations/Messages_cs_CZ.xml). Use --force to continue.

Aborted due to warnings.
```

it might be because your file does not end with LF, but with CRLF.

To fix this:

```bash
#Change your git config to LF
git config --global core.eol lf
git config --global core.autocrlf false

#You might have to change all the files in the repo
git rm -rf --cached .
git reset --hard HEAD
```

# Related links

 * Contribute: https://github.com/ovh-ux/grunt-ovh-translation
 * Report bugs: https://github.com/ovh-ux/grunt-ovh-translation/issues
 * Get latest version: https://github.com/ovh-ux/grunt-ovh-translation

# License

See https://github.com/ovh-ux/grunt-ovh-translation/blob/master/LICENSE
