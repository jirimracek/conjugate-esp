// TODO: come back here and see if we can really employ the accentuation rules instead of hunting
//       When: all verbs are tested so we have all possible cases
const PlainVowels: readonly string[] = ['a', 'e', 'i', 'o', 'u'];
const AccentedVowels: readonly string[] = ['á', 'é', 'í', 'ó', 'ú'];
const Diptongs: readonly string[] = [
  // 'iu', 'ui',                                 // 2 weaks
  'ai', 'au', 'ei', 'eu', 'oi', 'ou',         // Strong & weak
  'ia', 'ua', 'ie', 'ue', 'io', 'uo'          // Weak & strong
];
// export const Hiatos: ReadonlyArray<string> = [
//   'ae', 'ao', 'ea', 'eo', 'oa', 'oe',         // 2 strongs
//   'aí', 'aú', 'eí', 'eú', 'oí', 'oú',         // Strong & weak accented
//   'ía', 'úa', 'íe', 'úe', 'ío', 'úo'          // Weak accented & strong
// ];

const WeakVowels: readonly string[] = ['i', 'u'];
// export const AccentedWeakVowels: ReadonlyArray<string> = ['í', 'ú'];
const StrongVowels: readonly string[] = ['a', 'e', 'o'];

/**
 * Accentuate the 3rd vocal from the end of expression.  Does not clear accents so 'tú abrete' results in 'tú ábrete'
 * @param word expression to accentuate
 */
export function esdrujula(word: string): string {
  return accentuateWithDiptongRules(word, 3);
}

export function shiftAccentLeft(word: string): string {
  let match = RegExp(`(.*)(${AccentedVowels.join('|')})(.*)`).exec(word);
  if (!match || !match[2]) {
    return word;
  }
  const stringEnd = PlainVowels[AccentedVowels.indexOf(match[2])] + match[3];
  // Now find the next vowel from the end of match[1]
  match = RegExp(`(.*)(${PlainVowels.join('|')})(.*)`).exec(match[1]);
  if (!match || !match[2]) {
    return word;
  }
  return match[1] + AccentedVowels[PlainVowels.indexOf(match[2])] + match[3] + stringEnd;
}

export function clearAccents(word: string): string {
  return word.split('').map(letter => {
    const indexA = AccentedVowels.indexOf(letter);
    if (-1 === indexA) {
      return letter;
    }
    return PlainVowels[indexA];
  }).join('');
}

export function accentuateNthVowelFromEnd(word: string, nth: number): string {
  const vowels = PlainVowels.concat(AccentedVowels);
  let count = 0;
  let index = word.length - 1;
  while (index > -1) {
    if (vowels.includes(word[index])) {
      ++count;
      if (count === nth) {
        return accentAtIndex(word, index);
      }
      // If what we're looking at is accented and it's not the nth from the end, we have a problem elsewhere
      if (AccentedVowels.includes(word[index])) {
        return '-';
      }
    }
    --index;
  }
  return word;
}

function accentAtIndex(word: string, index: number): string {
  if (AccentedVowels.includes(word[index])) {
    return word;
  }
  const plainIndex = PlainVowels.indexOf(word[index]);
  const array = word.split('');
  array[index] = AccentedVowels[plainIndex];
  return array.join('');
}

function isDiptong(word: string, index: number): boolean {
  if ((index + 1 < word.length && Diptongs.includes(word[index] + word[index + 1])) ||
    (index > 0 && Diptongs.includes(word[index - 1] + word[index]))) {
    return true;
  }
  return false;
}

// Accentuate nth vowel from the end
// If the nth vowel is already accented, leave it along
// If the nth vowel is strong or a weak that doesn't form a diptong, accent it
//    else look for a next one to the left
// If we run into accented character and it is not the 3rd vowel from the end, complain?
export function accentuateWithDiptongRules(word: string, nth: number): string {
  const vowels = PlainVowels.concat(AccentedVowels);
  let count = 0;
  let index = word.length - 1;
  while (index > -1) {
    if (vowels.includes(word[index])) {
      ++count;
      if (count === nth) {
        break;
      }
      // If what we're looking at is accented and it's not the nth from the end, go back confused
      // This should never happen, what do I tell the user
      // case: llamaré  (you shouldn't try to accentuate it in the first place, it already has an accent) 
      if (AccentedVowels.includes(word[index])) {
        return word;
      }
    }
    --index;
  }
  // Have index of what we want to accentuate, is it already accented?
  // If so (from the basic form), leave it alone
  if (AccentedVowels.includes(word[index])) {
    return word;   // We're done
  }

  // Is it strong?
  // If the third falls on strong, accent it there
  if (StrongVowels.includes(word[index])) {
    return accentAtIndex(word, index);
  }

  // Look for the next vowel to the left of index
  // If the accent falls on a weak of diptong, shift it to the left
  if (isDiptong(word, index)) {
    --index;
    while (index > -1) {
      // If it's either a strong vowel or a weak one that doesn't form a diptong
      if (vowels.includes(word[index]) &&
        (StrongVowels.includes(word[index]) || !isDiptong(word, index))) {
        return accentAtIndex(word, index);
      }
      --index;
    }
  }
  // Else accentuate what we're looking at, it's weak but not a part of a diptong
  // This may happen if the word is shorter than the index.  Which would be a problem
  // TODO: come back here once we have all verbs tested 
  // console.warn(`stringutils, this shouldn't have happened, expression: '${word}', accentuate: ${index}`);
  return accentAtIndex(word, index);
}



