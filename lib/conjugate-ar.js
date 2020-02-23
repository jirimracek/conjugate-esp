/*!
   Copyright (c) 2020 Jiri Mracek jiri@automationce.com
   Copyright (c) 2020 Automation Controls & Engineering

   MIT License
*/
/**
 * Module to handle ar verbs
 */
const {terminationsAr} = require ('./common');


/**
 * Build the initial list of regular conjugations
 * @param {string} infinitiv
 * @return {string[]}  - Array of simple conjugations in the order listed in common.js
 * @see common.js 
 */
function buildRegularList (infinitiv) {
    const root = infinitiv.substring(0, infinitiv.length - 2);
    return terminationsAr.map(value => root + value);
}

/**
 * If the verb is irregular, process the irregularities here based on its model
 * @param {string []} list 
 */
function irregularChanges(list) {
    return list;
}

/**
 * Insert the compuestos in the list 
 * @param {string []} list
 * @returns {string[]} 
 * 
 * 
 */
function insertCompuestos (list) {
    return list;
}

/**
 * Whatever we need to do at the end
 * @param {string[]} list 
 */
function finalize (list) {
    return list;
}

function conjugateAr (infinitiv, voseo) {
    return finalize(insertCompuestos( irregularChanges(buildRegularList(infinitiv))));
}

module.exports = {
    conjugateAr
}