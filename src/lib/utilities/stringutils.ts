const Plain: readonly string[] = ['a', 'e', 'i', 'o', 'u', 'ü'];
const Accented: readonly string[] = ['á', 'é', 'í', 'ó', 'ú'];
const Vovels: readonly string[] = [...Plain, ...Accented];
const Strong: readonly string[] = ['a', 'e', 'o', 'á', 'é', 'í', 'ó', 'ú'];
const Unbreakable: readonly string[] = ['bl', 'cl', 'fl', 'gl', 'kl', 'll', 'pl', 'tl', 'br', 'cr', 'dr', 'fr', 'gr', 'kr', 'pr', 'rr', 'tr', 'ch'];

// References:
// https://tulengua.es/silabas/default.aspx
// https://www.diccionariodedudas.com/reglas-de-acentuacion-grafica-en-espanol/
// https://www.thefreelibrary.com/Word+division+in+spanish.-a06362173
// The idea:
// Infinite loop, each run processes one character. Consider current character and one or two following
// Decide whether they need to be broken up or stay together
// Break up rules: see 'Case:' inline comments
/**
 * Break given phrase into syllables
 * @param phrase 
 */
export function syllabify(phrase: string): string[] {
  if (!phrase || phrase === '') {
    return [''];
  }

  let current = 0;
  const result: string[] = [];
  while (true) {
    if (phrase.length === (current + 1)) {
      result.push(phrase[current]);
      break;
    }
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
          if (Unbreakable.includes(`${phrase[current + 1]}${phrase[current + 2]}`) || Vovels.includes(phrase[current + 2])) {
            result.push('-');
          }
          // Remaining Case: vowel + consonant + consonant, breakable group
        }
      }
      // Remaining Case: vowel + vowel (not two strongs)
    } else {   // Case: current is consonant
      if (!(Vovels.includes(phrase[current + 1]) || Unbreakable.includes(`${phrase[current]}${phrase[current + 1]}`))) {
        // Case: consonant + consonant, breakable group
        result.push('-');
      }
      // Remaining Case: consonant + vowel || consonant + consonant, unbreakable group
    }
    ++current;
  }
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
  let accentuated = syllable.replace(/([aeo])/, (match, p1): string => {
    return Accented[Plain.indexOf(p1)];
  });
  // If strong wasn't found, accentuate the weak, there is only one
  if (accentuated === syllable) {
    accentuated = syllable.replace(/([ui])/, (match, p1): string => {
      return Accented[Plain.indexOf(p1)];
    });
  }
  list[list.length - 3] = accentuated;
  expressions.push(list.join(''));
  return expressions.join(' ');
}

// clear only the last accent of the expression: él puó -> él puo
export function clearLastAccent(word: string): string {
  if (!word) return '';
  return word.replace(/(.*)([áéíóú])/, (match, p1, p2): string => {
    return `${p1}${Plain[Accented.indexOf(p2)]}`;
  });
}

// clear all accents
export function clearAccents(word: string): string {
  if (!word) return '';
  return word.replace(/([áéíóú])/g, (match, p1): string => {
    return Plain[Accented.indexOf(p1)];
  });
}
