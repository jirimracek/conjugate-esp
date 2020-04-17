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

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.monoSyllables = attributes['_ms_'] as boolean;

        // Initialize termination table, map ar terminations to the base
        // Clone so we don't overwrite the template
        this.desinences = JSON.parse(JSON.stringify(AR));

        // Give derived class a chance to modify the terms array one more time if needed
        this.configDesinences();

        // Finish desinences configuration in base class
        this.setDesinencesByRegion();
    }

    // Give derived classes chance to modify terms arrays
    protected configDesinences(): void {
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo' && !this.monoSyllables) {
            this.desinences.Indicativo.Presente[1] = 'ás';
        }
    }
    // Repeated pattern of indicativo presente stem modifications
    // The matrix looks like this
    //     person: 0 1 2 3 4 5     
    // castellano: . . .     .
    //      voseo: .   .   . .
    //  can & for: . . .   . . 
    protected setIndicativoPresentePattern_0125(replacement: string): void {
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, this.stem, replacement]);
                break;
            case 'voseo':
                super.setIndicativoPresente([replacement, this.stem, replacement, this.stem, replacement, replacement]);
                break;
            case 'canarias':
            case 'formal':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, replacement, replacement]);
                break;
        }
    }
    // Corresponding subj. presente patterns
    //            person: 0 1 2 3 4 5     
    //        castellano: . . .     .
    // voseo & can & for: . . .   . . 
    protected setSubjuntivoPresentePattern_0125(replacement: string, otherStem = this.stem): void {
        switch (this.region) {
            case 'castellano':
                super.setSubjuntivoPresente([replacement, replacement, replacement, otherStem, otherStem, replacement]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setSubjuntivoPresente([replacement, replacement, replacement, otherStem, replacement, replacement]);
                break;
        }
    }
}

export class actuar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)u/, '$1ú');
    }

    protected configDesinences(): void {
        super.configDesinences();
        if (this.monoSyllables) {             // strip monosyllable accents where applicable
            this.desinences.Indicativo.Presente[4] = 'ais';
            this.desinences.Indicativo.Preterito_Indefinido[0] = 'e';
            this.desinences.Indicativo.Preterito_Indefinido[2] = 'o';
            this.desinences.Subjuntivo.Presente[4] = 'eis';
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class agorar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/or$/, 'üer');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class aguar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/u$/, 'ü');
    }

    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }

    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
}

export class ahincar extends amar {
    private cToQ: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.cToQ = this.stem.replace(/c/, 'qu');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.stem.replace(/i/, 'í'));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.stem.replace(/inc/, 'ínqu'), this.cToQ);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido([this.cToQ, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }
}

export class aislar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/i/, 'í');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class andar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Preterito_Indefinido = ['uve', 'uviste', 'uvo', 'uvimos', 'uvisteis', 'uvieron'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_ra = ['uviera', 'uvieras', 'uviera', 'uviéramos', 'uvierais', 'uvieran'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_se = ['uviese', 'uvieses', 'uviese', 'uviésemos', 'uvieseis', 'uviesen'];
        this.desinences.Subjuntivo.Futuro_Imperfecto = ['uviere', 'uvieres', 'uviere', 'uviéremos', 'uviereis', 'uvieren'];
    }
}
export class cazar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/z$/, 'c');
    }
    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
}

export class contar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)o/, (match: string, p1: string): string => {
            if (p1.endsWith('g')) {
                return `${p1}üe`;
            }
            return `${p1}ue`;
        });
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class errar extends amar {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/^/, 'y');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class estar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Presente = ['oy', 'ás', 'á', 'amos', 'áis','án'];
        this.desinences.Indicativo.Preterito_Indefinido = ['uve', 'uviste', 'uvo', 'uvimos', 'uvisteis','uvieron'];
        this.desinences.Subjuntivo.Presente = ['é', 'és', 'é', 'emos', 'éis', 'én'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_ra = ['uviera', 'uvieras', 'uviera', 'uviéramos', 'uvierais','uvieran'];
        this.desinences.Subjuntivo.Preterito_Imperfecto_se = ['uviese', 'uvieses', 'uviese', 'uviésemos', 'uvieseis','uviesen'];
        this.desinences.Subjuntivo.Futuro_Imperfecto = ['uviere', 'uvieres', 'uviere', 'uviéremos', 'uviereis','uvieren'];
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.type === 'P') {
        switch(this.region) {
            default:
                this.table.Imperativo.Afirmativo[4] = clearLastAccent(this.table.Imperativo.Afirmativo[4]);
            case 'castellano': 
                this.table.Imperativo.Afirmativo[1] = clearLastAccent(this.table.Imperativo.Afirmativo[1]);
        }
        }
    }
}

export class pagar extends amar {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Preterito_Indefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = ['ue', 'ues', 'ue', 'uemos', 'uéis', 'uen'];
    }
}

export class pensar extends amar {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected setParticipio(): void {
        super.setParticipio();
        const PR = this.attributes['_pr_'] as string;
        if (PR) {
            const [expression, replacement] = PR.split('/');
            this.table.Impersonal.Participio[0] = this.table.Impersonal.Participio[0].replace(new RegExp(expression), replacement);
            this.participioCompuesto = this.table.Impersonal.Participio[0];
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class regar extends amar {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Preterito_Indefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = ['ue', 'ues', 'ue', 'uemos', 'uéis', 'uen'];
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}


export class vaciar extends amar {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)i/, '$1í');
    }

    protected configDesinences(): void {
        super.configDesinences();
        if (this.monoSyllables) {             // strip monosyllable accents where applicable
            this.desinences.Indicativo.Presente[4] = 'ais';
            this.desinences.Indicativo.Preterito_Indefinido[0] = 'e';
            this.desinences.Indicativo.Preterito_Indefinido[2] = 'o';
            this.desinences.Subjuntivo.Presente[4] = 'eis';
        }
    }

    protected setIndicativoPresente(): void {
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPresente([this.replacement, this.replacement, this.replacement, this.stem, this.stem, this.replacement]);
                break;
            case 'voseo':
                super.setIndicativoPresente([this.replacement, this.stem, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
            case 'canarias':
            case 'formal':
                super.setIndicativoPresente([this.replacement, this.replacement, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
        }
    }
    protected setSubjuntivoPresente(): void {
        switch (this.region) {
            case 'castellano':
                super.setSubjuntivoPresente([this.replacement, this.replacement, this.replacement, this.stem, this.stem, this.replacement]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setSubjuntivoPresente([this.replacement, this.replacement, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
        }
    }

}

export class sacar extends amar {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)c/, '$1qu');
    }
    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
}

export class volcar extends amar {

    private simple: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.simple = this.stem.replace(/c$/, 'qu');
    }

    protected setIndicativoPresente(): void {
        const replacement = this.stem.replace(/(.*)o/, '$1ue');
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, this.stem, replacement]);
                break;
            case 'voseo':
                super.setIndicativoPresente([replacement, this.stem, replacement, this.stem, replacement, replacement]);
                break;
            case 'canarias':
            case 'formal':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, replacement, replacement]);
                break;
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido([this.simple, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }

    protected setSubjuntivoPresente(): void {
        const complex = this.stem.replace(/(.*)o(.*)c/, '$1ue$2qu');
        switch (this.region) {
            case 'castellano':
                super.setSubjuntivoPresente([complex, complex, complex, this.simple, this.simple, complex]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setSubjuntivoPresente([complex, complex, complex, this.simple, complex, complex]);
                break;
        }
    }
}