/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
// npm t -- --watch
import { clearAccents, esdrujula, clearLastAccent, syllabify } from '../utilities/stringutils';
// silence legit warnings during tests 
// (they're useful in production, thus the conditions provoking these warnings
//  should be tested here but we don't want to clutter the terminal during test)
beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

describe("String Utils", () => {

    test('clearAccents', () => {

        expect(clearLastAccent('él puó')).toBe('él puo');


        expect(clearAccents('')).toBe('');
        expect(clearAccents(undefined as unknown as string)).toBe('');
        expect(clearAccents('abcd')).toBe('abcd');
        expect(clearAccents('abcdée')).toBe('abcdee');
        expect(clearAccents('áéíóú')).toBe('aeiou');
        expect(clearAccents('áb ícdé')).toBe('ab icde');

        expect(clearLastAccent('')).toBe('');
        expect(clearLastAccent(undefined as unknown as string)).toBe('');
        expect(clearLastAccent('él puó')).toBe('él puo');
        expect(clearLastAccent('abcd')).toBe('abcd');
        expect(clearLastAccent('abcdée')).toBe('abcdee');
        expect(clearLastAccent('áéíóú')).toBe('áéíóu');
        expect(clearLastAccent('áb ícde')).toBe('áb icde');
    });

    test('syllabify', () => {
        // Bad input
        expect(syllabify('')).toEqual(['']);
        expect(syllabify(undefined as unknown as string)).toEqual(['']);

        // No accents
        expect(syllabify('aguaitate')).toEqual(['a', 'guai', 'ta', 'te']);
        expect(syllabify('aguaitemonos')).toEqual(['a', 'guai', 'te', 'mo', 'nos']);
        expect(syllabify('aguantemonos')).toEqual(['a', 'guan', 'te', 'mo', 'nos']);
        expect(syllabify('ahuatate')).toEqual(['a', 'hua', 'ta', 'te']);
        expect(syllabify('ahuatemonos')).toEqual(['a', 'hua', 'te', 'mo', 'nos']);
        expect(syllabify('ahuatense')).toEqual(['a', 'hua', 'ten', 'se']);
        expect(syllabify('ahuatese')).toEqual(['a', 'hua', 'te', 'se']);
        expect(syllabify('alineemonos')).toEqual(['a', 'li', 'ne', 'e', 'mo', 'nos']);
        expect(syllabify('amaestrense')).toEqual(['a', 'ma', 'es', 'tren', 'se']);
        expect(syllabify('amollentense')).toEqual(['a', 'mo', 'llen', 'ten', 'se']);
        expect(syllabify('antarqueemonos')).toEqual(['an', 'tar', 'que', 'e', 'mo', 'nos']);
        expect(syllabify('aoptense')).toEqual(['a', 'op', 'ten', 'se']);
        expect(syllabify('apilgüense')).toEqual(['a', 'pil', 'güen', 'se']);
        expect(syllabify('azoemonos')).toEqual(['a', 'zo', 'e', 'mo', 'nos']);
        expect(syllabify('callate')).toEqual(['ca', 'lla', 'te']);
        expect(syllabify('desaparroquiate')).toEqual(['de', 'sa', 'pa', 'rro', 'quia', 'te']);
        expect(syllabify('desaparroquiense')).toEqual(['de', 'sa', 'pa', 'rro', 'quien', 'se']);
        expect(syllabify('desempeorense')).toEqual(['de', 'sem', 'pe', 'o', 'ren', 'se']);
        expect(syllabify('deslengüense')).toEqual(['des', 'len', 'güen', 'se']);

        expect(syllabify('igualense')).toEqual(['i', 'gua', 'len', 'se']);
        expect(syllabify('ionicemonos')).toEqual(['io', 'ni', 'ce', 'mo', 'nos']);
        expect(syllabify('ionicense')).toEqual(['io', 'ni', 'cen', 'se']);
        expect(syllabify('ionizate')).toEqual(['io', 'ni', 'za', 'te']);
        expect(syllabify('redondeate')).toEqual(['re', 'don', 'de', 'a', 'te']);
        expect(syllabify('sobreaguense')).toEqual(['so', 'bre', 'a', 'guen', 'se']);

        // Accentuated
        expect(syllabify('aguáitate')).toEqual(['a', 'guái', 'ta', 'te']);
        expect(syllabify('aguaitémonos')).toEqual(['a', 'guai', 'té', 'mo', 'nos']);
        expect(syllabify('aguantémonos')).toEqual(['a', 'guan', 'té', 'mo', 'nos']);
        expect(syllabify('ahuátate')).toEqual(['a', 'huá', 'ta', 'te']);
        expect(syllabify('ahuatémonos')).toEqual(['a', 'hua', 'té', 'mo', 'nos']);
        expect(syllabify('ahuátense')).toEqual(['a', 'huá', 'ten', 'se']);
        expect(syllabify('ahuátese')).toEqual(['a', 'huá', 'te', 'se']);
        expect(syllabify('alineémonos')).toEqual(['a', 'li', 'ne', 'é', 'mo', 'nos']);
        expect(syllabify('amaéstrense')).toEqual(['a', 'ma', 'és', 'tren', 'se']);
        expect(syllabify('amolléntense')).toEqual(['a', 'mo', 'llén', 'ten', 'se']);
        expect(syllabify('antarqueémonos')).toEqual(['an', 'tar', 'que', 'é', 'mo', 'nos']);
        expect(syllabify('aóptense')).toEqual(['a', 'óp', 'ten', 'se']);
        expect(syllabify('apílgüense')).toEqual(['a', 'píl', 'güen', 'se']);
        expect(syllabify('azoémonos')).toEqual(['a', 'zo', 'é', 'mo', 'nos']);
        expect(syllabify('cállate')).toEqual(['cá', 'lla', 'te']);
        expect(syllabify('desaparróquiate')).toEqual(['de', 'sa', 'pa', 'rró', 'quia', 'te']);
        expect(syllabify('desaparróquiense')).toEqual(['de', 'sa', 'pa', 'rró', 'quien', 'se']);
        expect(syllabify('desléngüense')).toEqual(['des', 'lén', 'güen', 'se']);
        expect(syllabify('desempeórense')).toEqual(['de', 'sem', 'pe', 'ó', 'ren', 'se']);
        expect(syllabify('iguálense')).toEqual(['i', 'guá', 'len', 'se']);
        expect(syllabify('ionicémonos')).toEqual(['io', 'ni', 'cé', 'mo', 'nos']);
        expect(syllabify('ionícense')).toEqual(['io', 'ní', 'cen', 'se']);
        expect(syllabify('ionízate')).toEqual(['io', 'ní', 'za', 'te']);
        expect(syllabify('redondéate')).toEqual(['re', 'don', 'dé', 'a', 'te']);
        expect(syllabify('sobreáguense')).toEqual(['so', 'bre', 'á', 'guen', 'se']);
    });

    test('esdrujula', () => {

        // Long expression (as long as an expression can be split in at least 3 syllables, it get accentuated)
        expect(esdrujula('one two three four short words, and a fifth expresion')).toEqual('one two three four short words, and a fifth éxpresion');

        // Bad cases
        // Already accented, no change
        expect(esdrujula('áu eohiúblamét')).toEqual('áu eohiúblamét');

        // Too short
        expect(esdrujula('')).toEqual('');
        expect(esdrujula('a')).toEqual('a');
        expect(esdrujula('é')).toEqual('é');
        expect(esdrujula('aeiou')).toEqual('aeiou');
        expect(esdrujula('one two three four short words, and a fifth xpresion')).toEqual('one two three four short words, and a fifth xpresion');

        expect(esdrujula(undefined as unknown as string)).toEqual(undefined);

        // real world
        expect(esdrujula('tú aguaitate')).toEqual('tú aguáitate');
        expect(esdrujula('tú ahuatate')).toEqual('tú ahuátate');
        expect(esdrujula('tú caigate')).toEqual('tú cáigate');
        expect(esdrujula('tú callate')).toEqual('tú cállate');
        expect(esdrujula('tú desaparroquiate')).toEqual('tú desaparróquiate');
        expect(esdrujula('tú hablame')).toEqual('tú háblame');
        expect(esdrujula('tú ionizate')).toEqual('tú ionízate');
        expect(esdrujula('tú muevete')).toEqual('tú muévete');
        expect(esdrujula('tú ')).toEqual('tú ');
        expect(esdrujula('tú vaporeate')).toEqual('tú vaporéate');
        expect(esdrujula('tú zurreate')).toEqual('tú zurréate');
        expect(esdrujula('tú redondeate')).toEqual('tú redondéate');

        expect(esdrujula('usted ahuatense')).toEqual('usted ahuátense');
        expect(esdrujula('usted ahuatese')).toEqual('usted ahuátese');
        expect(esdrujula('usted amollentense')).toEqual('usted amolléntense');
        expect(esdrujula('usted igualense')).toEqual('usted iguálense');
        expect(esdrujula('usted ionicense')).toEqual('usted ionícense');
        expect(esdrujula('usted santigüense')).toEqual('usted santígüense')

        expect(esdrujula('nosotros aguaitemonos')).toEqual('nosotros aguaitémonos');
        expect(esdrujula('nosotros aguantemonos')).toEqual('nosotros aguantémonos');
        expect(esdrujula('nosotros ahuatemonos')).toEqual('nosotros ahuatémonos');
        expect(esdrujula('nosotros alineemonos')).toEqual('nosotros alineémonos');
        expect(esdrujula('nosotros antarqueemonos')).toEqual('nosotros antarqueémonos');
        expect(esdrujula('nosotros azoemonos')).toEqual('nosotros azoémonos');
        expect(esdrujula('nosotros ionicemonos')).toEqual('nosotros ionicémonos');

        expect(esdrujula('ustedes aguaitense')).toEqual('ustedes aguáitense');
        expect(esdrujula('ustedes amaestrense')).toEqual('ustedes amaéstrense');
        expect(esdrujula('ustedes aoptense')).toEqual('ustedes aóptense');
        expect(esdrujula('ustedes apilgüense')).toEqual('ustedes apílgüense');
        expect(esdrujula('ustedes desaparroquiense')).toEqual('ustedes desaparróquiense');
        expect(esdrujula('ustedes desempeorense')).toEqual('ustedes desempeórense');
        expect(esdrujula('ustedes deslengüense')).toEqual('ustedes desléngüense');
        expect(esdrujula('ustedes rearmense')).toEqual('ustedes reármense');
        expect(esdrujula('ustedes sobreaguense')).toEqual('ustedes sobreáguense');
    });
});