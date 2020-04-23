/* eslint-disable @typescript-eslint/class-name-casing */
/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { clearLastAccent } from './utilities/stringutils';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { AR } from './declarations/constants';

/**
 * @class base class for all -ar conjugations
 */
export class amar extends BaseModel {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);

        // Initialize termination table, map ar terminations to the base
        // Clone so we don't overwrite the template
        this.desinences = JSON.parse(JSON.stringify(AR));

        // Voseo, 2nd singular -> accented version, which happens to be 2nd plural stripped of i
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = this.desinences.Indicativo.Presente[4].replace(/i/,'');
        } 
        // Give derived class a chance to modify the terms array one more time if needed
        this.configDesinences();

        // Finish desinences configuration in base class
        this.remapDesinencesByRegion();
    }

    // Give derived classes chance to modify terms arrays
    protected configDesinences(): void { /* empty */ }

    // Repeated pattern of indicativo presente stem modifications
    // The matrix looks like this
    //     person: 0 1 2 3 4 5     
    // castellano: . . .     .
    //      voseo: .   .   . .
    //  can & for: . . .   . . 
    // protected setIndicativoPresentePattern0125(alteredStem: string): void {
    //     switch (this.region) {
    //         case 'castellano':
    //             this.setTable('Indicativo', 'Presente', [
    //                 alteredStem, 
    //                 alteredStem,
    //                 alteredStem,
    //                 this.stem,
    //                 this.stem,
    //                 alteredStem
    //             ]);
    //             break;
    //         case 'voseo':
    //             this.setTable('Indicativo', 'Presente', [
    //                 alteredStem,
    //                 this.stem,
    //                 alteredStem,
    //                 this.stem,
    //                 alteredStem,
    //                 alteredStem
    //             ]);
    //             break;
    //         case 'canarias':
    //         case 'formal':
    //             this.setTable('Indicativo', 'Presente', [
    //                 alteredStem,
    //                 alteredStem,
    //                 alteredStem,
    //                 this.stem,
    //                 alteredStem,
    //                 alteredStem
    //             ]);
    //             break;
    //     }
    // }
    // Corresponding subj. presente patterns
    //            person: 0 1 2 3 4 5     
    //        castellano: . . .     .
    // voseo & can & for: . . .   . . 
    // protected setSubjuntivoPresentePattern0125(alteredStem: string, secondAltered = this.stem): void {
    //     switch (this.region) {
    //         case 'castellano':
    //             this.setTable('Subjuntivo', 'Presente',[
    //                 alteredStem,
    //                 alteredStem,
    //                 alteredStem,
    //                 secondAltered,
    //                 secondAltered,
    //                 alteredStem
    //             ]);
    //             break;
    //         case 'voseo':
    //         case 'canarias':
    //         case 'formal':
    //             this.setTable('Subjuntivo', 'Presente',[
    //                 alteredStem,
    //                 alteredStem,
    //                 alteredStem,
    //                 secondAltered,
    //                 alteredStem,
    //                 alteredStem
    //             ]);
    //             break;
    //     }
    // }

    // // Preterito Indefinido repeating pattern
    // protected setIndicativoPreteritoIndefinidoPattern0 (alteredStem: string): void {
    //     this.setTable('Indicativo', 'PreteritoIndefinido', [
    //         alteredStem, 
    //         ...Array.from('12345').map(() => this.stem)
    //     ]);
    // }
}

export class actuar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)u/, '$1ú');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class agorar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/or$/, 'üer');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class aguar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/u$/, 'ü');
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => this.alteredStem));
    }
}

export class ahincar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.stem.replace(/i/, 'í'));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/inc/, 'ínqu'), this.stem.replace(/c/, 'qu'));
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/c/, 'qu'));
    }
}

export class aislar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/i/, 'í');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class andar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = [
            'uve', 
            'uviste',
            'uvo',
            'uvimos',
            'uvisteis',
            'uvieron'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = [
            'uviera', 
            'uvieras',
            'uviera',
            'uviéramos',
            'uvierais',
            'uvieran'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoSe = [
            'uviese', 
            'uvieses',
            'uviese',
            'uviésemos',
            'uvieseis',
            'uviesen'
        ];
        this.desinences.Subjuntivo.FuturoImperfecto = [
            'uviere', 
            'uvieres',
            'uviere',
            'uviéremos',
            'uviereis',
            'uvieren'
        ];
    }
}
export class cazar extends amar {
    private alteredStem: string;
    
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/z$/, 'c');
    }
    
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => this.alteredStem));
    }
}

export class contar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, (match: string, p1: string): string => {
            if (p1.endsWith('g')) {
                return `${p1}üe`;
            }
            return `${p1}ue`;
        });
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}
export class enraizar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected setIndicativoPresente(): void {
        const alteredStem = this.stem.replace(/(.*)i/, '$1í');
        this.setIndicativoPresentePattern0125(alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/iz$/, 'íc'), this.stem.replace(/iz$/, 'ic'));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }
}

export class errar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/^/, 'y');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class estar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Indicativo.Presente = [
            'oy',
            'ás',
            'á',
            'amos',
            'áis',
            'án'
        ];
        this.desinences.Indicativo.PreteritoIndefinido = [
            'uve',
            'uviste',
            'uvo',
            'uvimos',
            'uvisteis', 
            'uvieron'
        ];
        this.desinences.Subjuntivo.Presente = ['é',
            'és',
            'é',
            'emos',
            'éis',
            'én'];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = [
            'uviera', 'uvieras', 'uviera', 'uviéramos', 'uvierais', 'uvieran'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoSe = [
            'uviese',
            'uvieses',
            'uviese',
            'uviésemos',
            'uvieseis',
            'uviesen'
        ];
        this.desinences.Subjuntivo.FuturoImperfecto = [
            'uviere',
            'uvieres',
            'uviere',
            'uviéremos',
            'uviereis',
            'uvieren'
        ];
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.type === 'P') {
            switch (this.region) {
                default:
                    this.table.Imperativo.Afirmativo[4] = clearLastAccent(this.table.Imperativo.Afirmativo[4]);
                    // intentional fall through
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
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = [
            'ue',
            'ues',
            'ue',
            'uemos',
            'uéis',
            'uen'
        ];
    }
}

export class pensar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected setParticipio(): void {
        super.setParticipio();
        const PR = this.attributes['PR'] as string;
        if (PR) {
            const [expression, alteredStem] = PR.split('/');
            this.table.Impersonal.Participio[0] = 
              this.table.Impersonal.Participio[0].replace(new RegExp(expression), alteredStem);
            this.participioCompuesto = this.table.Impersonal.Participio[0];
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class regar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = [
            'ue',
            'ues',
            'ue',
            'uemos',
            'uéis',
            'uen'
        ];
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class vaciar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)i/, '$1í');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class sacar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/c$/, 'qu'));
    }
    
    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/(.*)c/, '$1qu');
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => alteredStem));
    }
}

export class volcar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.stem.replace(/(.*)o/, '$1ue'));
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/c$/, 'qu'));
    }
    
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(
            this.stem.replace(/(.*)o(.*)c/, '$1ue$2qu'), 
            this.stem.replace(/c$/, 'qu'));
    }
}