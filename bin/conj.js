#!/usr/bin/env node
/*!
   Copyright (c) 2020 Jiri Mracek jiri@automationce.com
   Copyright (c) 2020 Automation Controls & Engineering

   MIT License
*/
'use strict';
const { conjugate } = require('../lib/conjugate');

/**
 * conjugate(infinitiv, region)
 */
(function main() {
   var infinitiv = process.argv[2];
   var region = process.argv[3];
   console.log(conjugate(infinitiv, region));
})();

