/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
// npm t -- --watch
import { clearAccents, shiftAccentLeft, accentuateNthVowelFromEnd, accentuateWithDiptongRules, esdrujula } from '../utilities/stringutils';
// silence legit warnings during tests 
// (they're useful in production, thus the conditions provoking these warnings
//  should be tested here but we don't want to clutter the terminal during test)
beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

test ('accentuation', () => {
    expect(clearAccents('abcd')).toBe('abcd');
    expect(clearAccents('abcdée')).toBe('abcdee');
    expect(clearAccents('áéíóú')).toBe('aeiou');
    expect(clearAccents('áb ícdé')).toBe('ab icde');

    expect(shiftAccentLeft('iavaciovacio')).toEqual('iavaciovacio');
    expect(shiftAccentLeft('iavaciovacióaeiuo')).toEqual('iavaciovacíoaeiuo');
    expect(shiftAccentLeft('iavaciovacióóaaeiuo')).toEqual('iavaciovacíóoaaeiuo');
    expect(shiftAccentLeft('iá')).toEqual('ía');
    expect(shiftAccentLeft('ái')).toEqual('ái');

    expect(accentuateNthVowelFromEnd('iavaciovacio', 1)).toEqual('iavaciovació');
    expect(accentuateNthVowelFromEnd('iavaciovacio', 15)).toEqual('iavaciovacio');
    expect(accentuateNthVowelFromEnd('iavaciovacio', 3)).toEqual('iavaciovácio');
    expect(accentuateNthVowelFromEnd('iavaciovacio', 4)).toEqual('iavacióvacio');
    expect(accentuateNthVowelFromEnd('iavaciovacio', 5)).toEqual('iavacíovacio');
    expect(accentuateNthVowelFromEnd('iavaciovacio', 8)).toEqual('íavaciovacio');
    expect(accentuateNthVowelFromEnd('iavaciovacío', 15)).toEqual('-');
    expect(accentuateNthVowelFromEnd('iavaciovació', 3)).toEqual('-')

    // this is the 'I am confused case that should never happen"
    expect(accentuateWithDiptongRules('llamaré', 3)).toEqual('llamaré');
    expect(accentuateWithDiptongRules('a', 3)).toEqual('a');
    expect(accentuateWithDiptongRules('ae', 3)).toEqual('ae');
    expect(accentuateWithDiptongRules('ae', 2)).toEqual('áe');
    expect(accentuateWithDiptongRules('', 3)).toEqual('');
    expect(accentuateWithDiptongRules('áéí', 3)).toEqual('áéí');
    expect(accentuateWithDiptongRules('aéí', 3)).toEqual('aéí');

    expect(esdrujula('usted santigüense')).toEqual('usted santígüense');

    
});

// const Accented: readonly string[] = ['á', 'é', 'í', 'ó', 'ú'];
// 
