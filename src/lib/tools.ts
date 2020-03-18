const Vowels: readonly string[] = ['a', 'e', 'i', 'o', 'u'];
const Accented: readonly string[] = ['á', 'é', 'í', 'ó', 'ú'];

/**
 * Accentuate the 3rd vocal from the end of expression.  Does not clear accents so 'tú abrete' results in 'tú ábrete'
 * @param word expression to accentuate
 */
export function esdrujula(word: string): string {
    return accentuateNthVowelFromEnd(word, 3);
}

/**
 * 
 * @param word expression to accentuate 
 * @param nth nth vocal from the end 
 */
function accentuateNthVowelFromEnd(word: string, nth: number): string {
    const vowels = Vowels.concat(Accented);
    let count = 0;
    let index = word.length - 1;
    while (index > -1) {
        if (vowels.includes(word[index])) {
            ++count;
            if (count === nth) {
                return accentAt(word, index);
            }
            // If what we're looking at is accented and it's not the nth from the end, we have a problem elsewhere
            if (Accented.includes(word[index])) {
                return '-';
            }
        }
        --index;
    }
    return word;
}
export function dropAccents(word: string): string {
    return word.replace(RegExp(`${Accented.join('|')}`, 'g'), (match): string => {
      if (-1 !== Accented.indexOf(match)) {
        return Vowels[Accented.indexOf(match)];
      }
      return match;
    });
  }

function accentAt(word: string, index: number): string {
    if (Accented.includes(word[index])) {
        return word;
    }
    const plainIndex = Vowels.indexOf(word[index]);
    const array = word.split('');
    array[index] = Accented[plainIndex];
    return array.join('');
}