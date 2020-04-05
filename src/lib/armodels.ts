/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { esdrujula, clearAccents, clearLastAccent } from './utilities/stringutils';
import { PronominalKeys, Regions, ModelAttributes, AttributeKeys } from './declarations/types';
import { TERM, AR, NONPRONOMINAL } from './declarations/constants';

/**
 * @class base class for all -ar conjugations
 */
export class amar extends BaseModel {
    protected monoSyllables = false;

    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);

        // Initialize termination table,map ar terminations to the base
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
            const entries = Object.entries(TERM[mode]);
            entries.push(...Object.entries(AR[mode]));
            // Clone so we don't overwrite the originals
            // Case: run voseo and follow by castellano, castellano will fail with ás on 2nd singular
            this.terms[mode] = JSON.parse(JSON.stringify(Object.fromEntries(entries)));
        });
        // Make local adjustments
        this.configTerminations();

        this.monoSyllables = attributes['MS' as AttributeKeys] as boolean;
    }

    protected configTerminations(): void {
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.terms.Indicativo.Presente[1] = 'ás';
        }
        // super makes voseo/formal/canarias swapping, call this last
        super.configTerminations();
    }

    protected setImperativoAfirmativo(): void {
        // Castellano
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: tú abandonas             => tú abandona   - drop 's'    
        //   P:                                   tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:   nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                   nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural indicativo presente:   vosotros abandonáis      => vosotros abandonad  - drop 'is', drop accent, attach 'd'
        //   P:                                   vosotros os abandonáis   => vosotros abandonaos - drop 'is', drop accent, switch pronombre os
        if (this.region === 'castellano') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/i?s$/, 'd'));
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                // This is the only line that's different between AR ER IR.  So far. 3/18/20
                this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));    // NOTE: ar == er != ir
            }
        }

        // Voseo
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: vos abandonás             => vos abandona   - drop 's'
        //   P:                                   vos te abandonás          => vos abandonate - drop 's', switch pronombre te, drop accent
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:   nosotros abandonemos      => nosotros abandonemos   - no change
        //   P:                                   nosotros nos abandonemos  => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural subjuntivo presente:   ustedes abandonen         => ustedes abandonen   - no change
        //   P:                                   ustedes se abandonen      => ustedes abandónense - switch pronombre se, esdrujula
        if (this.region === 'voseo') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = clearAccents(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                this.table.Imperativo.Afirmativo[4] = esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2'));
            }
        }

        // Formal
        // 2nd singular, idx 1:
        //   N: 2nd singular subjuntivo presente:  usted abandone             => usted abandone - no change    
        //   P:                                    usted se abandone          => usted abandónese - switch pronombre se, esdrujula
        // 1st plural, idx 3: 
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4: 
        //   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
        //   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
        if (this.region === 'formal') {
            if (this.type === NONPRONOMINAL) {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = this.table.Subjuntivo.Presente[index]);
            } else {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = esdrujula(this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2')));
            }
        }
        // Canarias
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente:  tú abandonas             => tú abandona   - drop 's'    
        //   P:                                    tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
        //   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
        if (this.region === 'canarias') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                this.table.Imperativo.Afirmativo[4] = esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2'));
            }
        }

        // 1st plural, idx 3 - same for all regions
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        if (this.type === NONPRONOMINAL) {
            this.table.Imperativo.Afirmativo[3] = this.table.Subjuntivo.Presente[3];
        } else {
            this.table.Imperativo.Afirmativo[3] = esdrujula(this.table.Subjuntivo.Presente[3].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
        }
    }
}


export class actuar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.*)u(.*)/;
        const replacement = '$1ú$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 5], pattern, replacement);
            if (this.monoSyllables) {             // strip monosyllable accents where applicable
                this.table.Indicativo.Presente[4] = clearLastAccent(this.table.Indicativo.Presente[4]);
                [0, 2].forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = clearLastAccent(this.table.Indicativo.Preterito_Indefinido[index]));
                this.table.Subjuntivo.Presente[4] = clearLastAccent(this.table.Subjuntivo.Presente[4]);
            }
        } else if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
            if (this.monoSyllables) {
                this.table.Indicativo.Presente[1] = clearLastAccent(this.table.Indicativo.Presente[1]);
                [0, 2].forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = clearLastAccent(this.table.Indicativo.Preterito_Indefinido[index]));
            }
        } else {
            // shared between canarias and formal
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
            if (this.region === 'canarias' && this.monoSyllables) {
                [0, 2].forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = clearLastAccent(this.table.Indicativo.Preterito_Indefinido[index]));
            }
            if (this.region === 'formal' && this.monoSyllables) {
                [0, 1, 2].forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = clearLastAccent(this.table.Indicativo.Preterito_Indefinido[index]));
            }
        }
    }
}

export class agorar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)gor(.*)/;
        const replacement = '$1güer$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
    }
}

export class aguar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)gu(.*)/;
        const replacement: string = '$1gü$2';
        this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        this.replaceIndicativoPreteritoIndefinito([0], pattern, replacement);
    }
}

export class ahincar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)inc(.*)/;
        this.replaceIndicativoPreteritoIndefinito([0], pattern, '$1inqu$2');
        this.replaceSubjuntivoPresente([3], pattern, '$1inqu$2');

        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, '$1ínc$2');
            this.replaceSubjuntivoPresente([0, 1, 2, 5], pattern, '$1ínqu$2');
            this.replaceSubjuntivoPresente([4], pattern, '$1inqu$2');
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, '$1ínc$2');
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, '$1ínqu$2');
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, '$1ínc$2');
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, '$1ínqu$2');
        }
    }
}
export class aislar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)(a|e|h)i(.*)/;
        const replacement: string = '$1$2í$3';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
    }
}
export class andar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected configTerminations(): void {
        this.terms.Indicativo.Preterito_Indefinido = ['uve', 'uviste', 'uvo', 'uvimos', 'uvisteis', 'uvieron'];
        this.terms.Subjuntivo.Preterito_Imperfecto_ra = ['uviera', 'uvieras', 'uviera', 'uviéramos', 'uvierais', 'uvieran'];
        this.terms.Subjuntivo.Preterito_Imperfecto_se = ['uviese', 'uvieses', 'uviese', 'uviésemos', 'uvieseis', 'uviesen'];
        this.terms.Subjuntivo.Futuro_Imperfecto = ['uviere', 'uvieres', 'uviere', 'uviéremos', 'uviereis', 'uvieren'];
        // Let the parents do their job
        super.configTerminations();
    }
}
export class cazar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }
    protected beforeImperatives(): void {
        const pattern: RegExp = /(.[aeioulnr])z([eé].*)/;
        const replacement = '$1c$2';
        this.replaceIndicativoPreteritoIndefinito([0], pattern, replacement);
        this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
    }
}
export class pensar extends amar {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected afterImpersonales(): void {
        const PR = this.attributes['PR'] as string;
        if (PR) {
            const [expression, replacement] = PR.split('/');
            this.table.Impersonal.Participio[0] = this.table.Impersonal.Participio[0].replace(new RegExp(expression), replacement);
            this.participioCompuesto = this.table.Impersonal.Participio[0];
        }

    }

    protected beforeImperatives(): void {
        const patternI: RegExp = /(.*)e(.*)/;
        const patternS: RegExp = /(.*)e(?=.*e)(.*)/;
        const replacement: string = '$1ie$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], patternI, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 5], patternS, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], patternI, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], patternS, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], patternI, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], patternS, replacement);
        }
    }
}