# Building Bridges

This project was developed in the context of a computer practical at university.

## Getting started

You'll need NodeJS (I've used v0.10.31 on a 64bit Debian) and Grunt-Cli (v0.1.13 here) in order to comprehend this project.
Here's a quick instruction how to get started.

 1. Create two directories, if they aren't present yet: `mkdir $HOME/src && mkdir $HOME/bin`
 1. Open `$HOME/.bashrc` and add a line: `export PATH=$PATH:$HOME/bin`
 1. Install NodeJS (either via your package manager or as binary from [their site](http://www.nodejs.org/download/))
   1. In case you grabbed the binary, make sure to unpack it, say to `$HOME/src` and symlink the binary:
 `ln -s $HOME/src/node-v0.10.31-linux-x64/bin/node $HOME/bin/node && ln -s $HOME/src/node-v0.10.31-linux-x64/bin/npm $HOME/bin/npm`
 1. Once you have `node` and `npm` in your `$PATH` download grunt-cli:
 `cd $HOME/src && npm install grunt-cli && ln -s $HOME/src/node_modules/.bin/grunt $HOME/bin/grunt`
 1. Now clone the repo to `$HOME/src/BuildingBridges.git`
 1. Change into the directory and install the dependencies: `cd $HOME/src/BuildingBridges.git && npm install`
 1. Run `grunt` several times in order to generate the files below:
   * `grunt doc` → `$HOME/src/BuildingBridges.git/doc/`
   * `grunt test:coverage` → `$HOME/src/BuildingBridges.git/bin/`
   * `grunt test` → `$HOME/src/BuildingBridges.git/test/`

## The results so far

Sadly, I wasn't able to finish writing the tests and docs within that scope.

However you'll find what I've done at the following places:

 * Project itself: BuildingBridges.git/index.html
 * Documentation: BuildingBridges.git/doc/index.html
 * Test coverage: BuildingBridges.git/bin/coverage/html/index.html
 * Spec results: BuildingBridges.git/test/SpecRunner.html

I've used grunt while developing. You can derive the tasks from the Gruntfile.js.
