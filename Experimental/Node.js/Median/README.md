Node.js Experiment
=================

This is an experiment with running the Median module from a command-prompt using NodeJS.

Procedure for Windows:

* Download Node.js from http://nodejs.org/
* Install it
* Open the Node.js command prompt
* Type npm install jasmine-node -g (To install jasmine-node unit test framework. See https://github.com/mhevery/jasmine-node)
* cd <Directory where you cloned OpenEpi.com repository to>\Experimental\Node.js\Median
* Type jasmine-node Specs
* Expect to see "2 tests, 6 assertions, 0 failured"

If that worked, then the experiment was repeatable and the good :) Feel free to add additional test cases inside of the Specs folder files.