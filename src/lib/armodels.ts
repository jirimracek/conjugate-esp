/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { clearAccents, clearLastAccent } from './utilities/stringutils';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { AR } from './declarations/constants';

/**
 * @class base class for all -ar conjugations
 */
export class amar extends BaseModel {
    protected monoSyllables = false;

    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
        this.monoSyllables = attributes['_ms_'] as boolean;

        // Initialize termination table, map ar terminations to the base
        // Clone so we don't overwrite the template
        this.desinences = JSON.parse(JSON.stringify(AR));

        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'ás';
        }

        // Give derived class a chance to modify the terms array one more time if needed
        this.localTermConfig();

        // Finish the term configuration
        this.finishTermConfig();
    }

    // Give derived classes chance to modify terms arrays
    protected localTermConfig(): void { }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' && this.type !== 'N') {
            // This is the only line that's different between AR ER IR.  So far. 3/18/20
            this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));    // NOTE: ar == er != ir
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

    protected localTermConfig(): void {
        this.desinences.Indicativo.Preterito_Indefinido = ['uve', 'uviste', 'uvo', 'uvimos', 'uvisteis', 'uvieron'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_ra = ['uviera', 'uvieras', 'uviera', 'uviéramos', 'uvierais', 'uvieran'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_se = ['uviese', 'uvieses', 'uviese', 'uviésemos', 'uvieseis', 'uviesen'];
        this.desinences.Subjuntivo.Futuro_Imperfecto = ['uviere', 'uvieres', 'uviere', 'uviéremos', 'uviereis', 'uvieren'];
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
        const PR = this.attributes['_pr_'] as string;
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