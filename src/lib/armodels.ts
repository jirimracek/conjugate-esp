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
            this.desinences.Indicativo.Presente[1] = this.desinences.Indicativo.Presente[4].replace(/i/, '');
        }
        // Give derived class a chance to modify the desinences as per model
        this.configDesinences();

        // Finish desinences configuration in base class
        this.remapDesinencesByRegion();
    }

    // Give derived classes chance to modify terms arrays
    protected configDesinences(): void { /* empty */ }
}

export class actuar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)u/, '$1ú');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.stem.replace(/i/, 'í'), this.stem.replace(/i/, 'í'));
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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

export class aullar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/u/, 'ú');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class avergonzar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'üe');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/onz/, 'üenc'), this.stem.replace(/z$/, 'c'));
    }
}
export class cabrahigar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/i/, 'í');
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/^/, 'u');
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'u'));
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class colgar extends amar {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'ue');
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/^/, 'u');
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'u'))
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}
export class dar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/$/, 'y');
        [1, 4].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/á/, 'a'));

        [0, 1, 3, 4].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^./, 'i'));
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/^./, 'io');
        this.desinences.Indicativo.PreteritoIndefinido[5] =
            this.desinences.Indicativo.PreteritoIndefinido[5].replace(/^./, 'ie');

        [0, 2].forEach(i => this.desinences.Subjuntivo.Presente[i] =
            this.desinences.Subjuntivo.Presente[i].replace(/./, 'é'));
        this.desinences.Subjuntivo.Presente[4] =
            this.desinences.Subjuntivo.Presente[4].replace(/./, 'e');

        [0, 1, 2, 4, 5].forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/./, 'ie'));
        this.desinences.Subjuntivo.PreteritoImperfectoRa[3] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[3].replace(/./, 'ié');

        [0, 1, 2, 4, 5].forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/./, 'ie'));
        this.desinences.Subjuntivo.PreteritoImperfectoSe[3] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[3].replace(/./, 'ié');

        [0, 1, 2, 4, 5].forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/./, 'ie'));
        this.desinences.Subjuntivo.FuturoImperfecto[3] =
            this.desinences.Subjuntivo.FuturoImperfecto[3].replace(/./, 'ié');
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.type === 'P' && this.region === 'formal') {
            this.table.Imperativo.Afirmativo[1] = clearLastAccent(this.table.Imperativo.Afirmativo[1]);
        }
    }
}
export class desdar extends dar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        super.configDesinences();
        [1, 2, 4, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/a/, 'á'));

        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/i/, 'í');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/o/, 'ó');

        [1, 4, 5].forEach(i => this.desinences.Subjuntivo.Presente[i] =
            this.desinences.Subjuntivo.Presente[i].replace(/e/, 'é'));
    }
}

export class desosar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'hue');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class empezar extends amar {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/e(.?)z$/, 'ie$1z');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/e(.?)z$/, 'ie$1c'), this.stem.replace(/z$/, 'c'));
    }
}

export class enraizar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected setIndicativoPresente(): void {
        const alteredStem = this.stem.replace(/(.*)i/, '$1í');
        this.setIndicativoPresentePattern125(alteredStem, alteredStem);
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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

export class forzar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPresente(): void {
        const local = this.stem.replace(/o/, 'ue');
        this.setIndicativoPresentePattern125(local, local);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/orz/, 'uerc'), this.stem.replace(/z/, 'c'))
    }
}

export class jugar extends amar {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPresente(): void {
        const local = this.stem.replace(/g/, 'eg');
        this.setIndicativoPresentePattern125(local, local);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/g$/, 'gu'));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/g$/, 'egu'), this.stem.replace(/g$/, 'gu'))
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
            this.participioCompuesto = this.participioCompuesto.replace(expression, alteredStem);
            this.table.Impersonal.Participio[0] = this.participioCompuesto;
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
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
        this.setIndicativoPresentePattern125(this.stem.replace(/(.*)o/, '$1ue'), this.stem.replace(/(.*)o/, '$1ue'));
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