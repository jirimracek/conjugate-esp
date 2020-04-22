/* eslint-disable array-element-newline */
/* eslint-disable max-len */
const Plain: readonly string[] = [ 'a', 'e', 'i', 'o', 'u', 'ü'];
const Accented: readonly string[] = ['á', 'é', 'í', 'ó', 'ú'];
const Vovels: readonly string[] = [...Plain, ...Accented];
const Strong: readonly string[] = ['a', 'e', 'o', 'á', 'é', 'í', 'ó', 'ú'];
const Unbreakable: readonly string[] = [ 'bl', 'cl', 'fl', 'gl', 'kl', 'll', 'pl', 'tl', 'br', 'cr', 'dr', 'fr', 'gr', 'kr', 'pr', 'rr', 'tr', 'ch' ];
/* eslint-enable max-len */
/* eslint-enable array-element-newline */

// References:
// https://tulengua.es/silabas/default.aspx
// https://www.diccionariodedudas.com/reglas-de-acentuacion-grafica-en-espanol/
// https://www.thefreelibrary.com/Word+division+in+spanish.-a06362173
// The idea:
// Each loop run processes one character. Consider current character and one or two following
// Decide whether they need to be broken up or stay together
// Break up rules: see 'Case:' inline comments
/**
 * Break given phrase into syllables
 * @param phrase 
 */
export function syllabify(phrase: string): string[] {
    if (!phrase) {
        return [''];
    }
    if (phrase.length < 2) {
        return [phrase];
    }

    let current = 0;
    const result: string[] = [];
    while (phrase.length > (current + 1)) {
        result.push(phrase[current]);

        // Case: current is vowel
        if (Vovels.includes(phrase[current])) {
            // Case: strong + strong (AA, AO, AE, EO,...), break them
            if (Strong.includes(phrase[current]) && Strong.includes(phrase[current + 1])) {
                result.push('-');
            }
            // Case: vowel + consonant
            if (!Vovels.includes(phrase[current + 1])) {
                if ((current + 2) < phrase.length) {
                    // Case: vowel + consonant + consonant, nonbreakable group || vowel + consonant + vowel
                    if (Unbreakable.includes(`${phrase[current + 1]}${phrase[current + 2]}`) || 
                    Vovels.includes(phrase[current + 2])) {
                        result.push('-');
                    }
                    // Remaining Case: vowel + consonant + consonant, breakable group
                }
            }
            // Remaining Case: vowel + vowel (not two strongs)
        } else {   // Case: current is consonant
            if (!(Vovels.includes(phrase[current + 1]) ||
             Unbreakable.includes(`${phrase[current]}${phrase[current + 1]}`))) {
                // Case: consonant + consonant, breakable group
                result.push('-');
            }
            // Remaining Case: consonant + vowel || consonant + consonant, unbreakable group
        }
        ++current;
    }
    result.push(phrase[current]);
    return result.join('').split('-');
}

/**
 * Accentuate 3rd syllable (esdrujula) from the end (ignore all but the last word). 
 * 
 * Ex: "whatever, not ímpórtánt tú c**a**llate" -> "whatever, not ímpórtánt tú c**á**llate" 
 * @param phrase to have the esdrujula accentuated
 */
export function esdrujula(phrase: string): string {
    if (!phrase) return phrase;
    const expressions = phrase.split(' ');
    const last = expressions.pop() as string;
    if (/[áéíóú]/.test(last)) {
        return phrase;
    }
    const list = syllabify(last);
    if (list.length < 3) {
        return phrase;
    }

    const syllable = list[list.length - 3];     // get 3rd from the end and operate on it
    if (/[aeo]/.test(syllable)) {               // has a strong vowel? (may not have more than one)
        list[list.length - 3] = syllable.replace(/([aeo])/, (match, p1): string => {
            return Accented[Plain.indexOf(p1)];
        });
    } else {                                   // one or more weak ones, accentuate the last one
        list[list.length - 3] = syllable.replace(/(.*)([ui])/, (match, p1, p2): string => {
            return `${p1}${Accented[Plain.indexOf(p2)]}`;
        });
    }
    expressions.push(list.join(''));
    return expressions.join(' ');
}

/**
 * Make the nth syllable from the end strong if it already isn't. Accentuate weak
 * @param phrase to strong-ify
 * @param nth nth syllable from the end (1 == last syllable, 2 == next to last ...)
 */
export function strongify(phrase: string, nth: number): string {
    if (nth < 1 || undefined === phrase || '' === phrase) {
        return phrase;
    }
    const syllables = syllabify(phrase);
    const index = syllables.length - nth;
    if (index < 0) {
        return phrase;
    }
    if (/[aeoáéíóú]/.test(syllables[index])) {
        return phrase;           // already strong
    }
    syllables[index] = syllables[index].replace(/(.*)([ui])(.*)/, (match, p1, p2, p3): string => {
        return `${p1}${Accented[Plain.indexOf(p2)]}${p3}`;
    });
    return syllables.join('');
}

/**
 * clear only the last accent of the expression: él puó -> él puo
 * @param word 
 */
export function clearLastAccent(word: string): string {
    if (!word) return '';
    return word.replace(/(.*)([áéíóú])/, (match, p1, p2): string => {
        return `${p1}${Plain[Accented.indexOf(p2)]}`;
    });
}

/**
 * clear all accents
 * @param word 
 */
export function clearAccents(word: string): string {
    if (!word) return '';
    return word.replace(/([áéíóú])/g, (match, p1): string => {
        return Plain[Accented.indexOf(p1)];
    });
}

/**
 * apply monosyllable accent rules to the last word of the phrase. If the word 
 * has an accent on a strong vowel, remove it, otherwise leave it alone
 * 
 * @param phrase 
 */
export function applyMonoRules(phrase: string): string {
    if (undefined === phrase || '' === phrase.trim()) {
        return phrase;
    }
    const words = phrase.split(' ');
    const last = words.pop() as string;
    // Would it be a monosyllable if it didn't have any accent?
    if (syllabify(clearAccents(last)).length !== 1) {
        return phrase;
    }

    // If a strong one has an accent, remove it
    if (/[áéó]/.test(last)) {
        words.push(clearAccents(last))
        return words.join(' ');
    }
    
    // If there is a strong and it is not accented, return, accent belongs to the weak
    if (/[aeo]/.test(last)) {
        return phrase;
    }

    // No strongs, remove accent
    // in theory we allow for an accent on the first one but we don't seem to have that case
    if (/[iu][íú][iu]*/.test(last)) {
        words.push(clearAccents(last))
        return words.join(' ');
    }
    return phrase;
}
