/**
 * @copyright 
 * Copyright (c) 2020-2021 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020-2021 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import {Regions} from '../index';

// shuffle lists so we don't test in the same order every time
export function shuffle(array: string[]): string[] {
    let count = array.length, temp, index;
    while (count) {
        // Pick remaining 
        index = Math.floor(Math.random() * count--);
        // swap with current 
        temp = array[count];
        array[count] = array[index];
        array[index] = temp;
    }
    return array;
}

export function getRegions(): Regions[] {
    return shuffle(['castellano', 'voseo', 'formal', 'canarias']) as Regions[];
}

export const verbsToTest = [
    // some interesting verbs
    'abarse',        // the only known trimorfo              
    'abolir',      // interesting imorfo                   
    'acostumbrar', // omorfo                              
    'aclarar',     // dual, defective                      
    'acontecer',   // single defective                     
    'adecuar',     // dual, non defective                  
    'antojarse',     // defective terciopersonal v2          
    'argüir',
    'balbucir',    // combo of ir & ar verb, very unique
    'caerse',
    'colorir',     // imorfo                               
    'condecir',    // the decir family of differences      
    'chiar',       // monosyllables
    'ciar',        // monosyllables
    'criar',       // monosyllables
    'darse',
    'degollar',    // contar, o -> üe
    'derrocar',    // dual volcar, sacar                   
    'desvaír',     // dual, ír, defective in both N&P      
    'embaír',
    'embaírse',
    'empecer',     // the only known tercio               
    'empedernir',  // the only bimorfop, dual defective    
    'errar',       // err -> yerr                          
    'escribir',
    'erguir',
    'erguirse',
    'estarse',
    'fiar',        // monosyllables
    'fluir',       // monosyllables
    'freír',       // monosyllables, dual participio
    'fruir',       // monosyllables
    'guiar',       // dual vaciar, monosyllables           
    'gruir',       // monosyllables
    'huir',        // monosyllables
    'inhestar',    // participio irregular, replace        
    'imprimir',
    'ir',
    'irse',
    'liar',        // monosyllables
    'luir',        // monosyllables
    'marcir',      // eimorfo                              
    'miar',        // monosyllables
    'morir',
    'muir',        // monosyllables
    'piar',        // monosyllables
    'predecir',    // the decir family of differences
    'pringar',     // dual pagar                           
    'proscribir',
    'proveer',
    'puar',        // dual, monosyllables                  
    'raspahilar',  // the only bimorfog we have
    'redecir',     // the decir family of differences
    'reír',
    'reírse',
    'reponer',     // ogmorfo                              
    'responder',   // in the list already, quite unique, repuse version   
    'ruar',        // monosyllables
    'satisfacer',
    'serenar',     // triple, defective in one, N&P        
    'sofreír',
    'soler',       // the name said it all                 
    'triar',       // monosyllables
    'tronar',      // from contar                          
    'ventar'       // triple, defective                    
];

export const monos = [
    'freír',
    'reír',
    'reírse',
    'puar',
    'ruar',
    'chiar',
    'ciar',
    'criar',
    'fiar',
    'guiar',
    'liar',
    'miar',
    'piar',
    'triar',
    'fluir',
    'fruir',
    'gruir',
    'huir',
    'huirse',
    'luir',
    'muir'
];