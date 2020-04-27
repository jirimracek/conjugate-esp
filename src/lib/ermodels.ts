/* eslint-disable @typescript-eslint/class-name-casing */
/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { ER } from './declarations/constants';

export class temer extends BaseModel {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(ER));
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = this.desinences.Indicativo.Presente[4].replace(/i/, '');
        }
        this.configDesinences();
        this.remapDesinencesByRegion();
    }

    protected configDesinences(): void { /* empty */ }
}

export class caber extends temer {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ab/, 'up');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/.*/, 'quep');
        this.secondAlteredStemArray = Array.from('012345').map(() => this.secondAlteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/í/, 'e');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');

        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían']
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.secondAlteredStem,
            ...Array.from('12345').map(() => this.stem)
        ]);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.secondAlteredStemArray);
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }
    
}
export class caer extends temer {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        this.desinences.Impersonal.Participio = ['ído'];
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');

        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];

        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'ig'));
        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
        this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
        this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}
export class coger extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/g$/, 'j');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
    }
    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array.from('12345').map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
    }
}


export class hacer extends temer {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/acid/, 'ech');
        this.table.Impersonal.Participio = [this.participioCompuesto];
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían']
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.stem.replace(/c$/, 'g'),
            ...Array.from('12345').map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        const acToIz = this.stem.replace(/ac$/, 'iz');
        switch (this.region) {
            default:
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    local,
                    local,
                    acToIz,
                    local,
                    local,
                    local
                ]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    local,
                    acToIz,
                    acToIz,
                    local,
                    local,
                    local
                ]);
        }
    }
    protected setIndicativoFuturoImperfecto(): void {
        const local = this.stem.replace(/c$/, '');
        this.setTable('Indicativo', 'FuturoImperfecto', Array.from('012345').map(() => local));
    }
    protected setIndicativoCondicionalSimple(): void {
        const local = this.stem.replace(/c$/, '');
        this.setTable('Indicativo', 'CondicionalSimple', Array.from('012345').map(() => local));
    }

    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/c$/, 'g');
        this.setTable('Subjuntivo', 'Presente', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'FuturoImperfecto', Array.from('012345').map(() => local));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        switch (this.region) {
            case 'castellano':
            case 'canarias':
                if (this.version === '0') {
                    this.table.Imperativo.Afirmativo[1] =
                        this.table.Imperativo.Afirmativo[1].replace(/[aá]ce/, 'az');
                }
        }
    }
}

export class rehacer extends hacer {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        const acToIz = this.stem.replace(/ac$/, 'íz');
        switch (this.region) {
            default:
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem.replace(/(.*)a/, '$1í'),
                    local,
                    acToIz,
                    local,
                    local,
                    local
                ]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem.replace(/(.*)a/, '$1í'),
                    acToIz,
                    acToIz,
                    local,
                    local,
                    local
                ]);
        }
    }
}

export class haber extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Indicativo.Presente = ['e', 'as', 'a', 'emos', 'éis', 'an'];
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían']
    }
    protected setIndicativoPresente(): void {
        const local = this.stem.replace(/ab/, '');
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [
                    local,
                    local,
                    local,
                    local,
                    this.stem,
                    local
                ]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                this.setTable('Indicativo', 'Presente', Array.from('012345').map(() => local));
                break;
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Indicativo', 'PreteritoIndefinido', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/b/, 'y');
        this.setTable('Subjuntivo', 'Presente', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'FuturoImperfecto', Array.from('012345').map(() => local));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        switch (this.region) {
            case 'castellano':
            case 'voseo':
            case 'canarias':
                this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/a/, 'e');
                break;
        }
    }
}

export class leer extends temer {
    private participioDual: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.participioDual = this.attributes.PD as string;
    }

    protected setParticipio(): void {
        if (this.participioDual) {
            const [searchValue, replaceValue] = this.participioDual.split('/');
            this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`;
            this.participioCompuesto =
                `${this.participioCompuesto}/${this.participioCompuesto.replace(searchValue, replaceValue)}`;
            this.table.Impersonal.Participio = [this.participioCompuesto];
        } else {
            super.setParticipio();
        }
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio =
            this.desinences.Impersonal.Gerundio.map(g => g.replace(/i/, 'y'));

        this.desinences.Impersonal.Participio =
            this.desinences.Impersonal.Participio.map(g => g.replace(/i/, 'í'));

        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
        this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
        this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}

export class mover extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, '$1ue');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class nacer extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/s?c$/, 'zc');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            this.stem,
            this.stem,
            this.stem,
            this.stem,
            this.stem
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array.from('012345').map(() => this.alteredStem));
    }
}

export class oler extends temer {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/^o/, 'hue');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class placer extends temer {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'zc');
    }

    protected configDesinences(): void {
        if (this.version === '1') {
            this.desinences.Indicativo.PreteritoIndefinido[2] =
                this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');
        }
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array.from('12345').map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoIndefinido');
        } else {
            const local = this.stem.replace(/ac/, 'ug');
            if (this.region === 'formal') {
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    local,
                    local,
                    this.stem,
                    this.stem,
                    this.stem
                ]);
            } else {
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    local,
                    this.stem,
                    this.stem,
                    this.stem
                ]);
            }
        }
    }

    protected setSubjuntivoPresente(): void {
        if (this.version === '0') {
            this.setTable('Subjuntivo', 'Presente',
                Array.from('012345').map(() => this.alteredStem));
        } else {
            const local = this.stem.replace(/ac/, 'eg');
            if (this.region === 'formal') {
                this.setTable('Subjuntivo', 'Presente', [
                    this.alteredStem,
                    local,
                    local,
                    this.alteredStem,
                    this.alteredStem,
                    this.alteredStem
                ]);
            } else {
                this.setTable('Subjuntivo', 'Presente', [
                    this.alteredStem,
                    this.alteredStem,
                    local,
                    this.alteredStem,
                    this.alteredStem,
                    this.alteredStem
                ]);
            }
        }
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        if (this.version === '0') {
            this.setTable('Subjuntivo', 'PreteritoImperfectoRa');
        } else {
            const local = this.stem.replace(/ac/, 'ugu');
            if (this.region === 'formal') {
                this.setTable('Subjuntivo', 'PreteritoImperfectoRa', [
                    this.stem,
                    local,
                    local,
                    this.stem,
                    this.stem,
                    this.stem
                ]);
            } else {
                this.setTable('Subjuntivo', 'PreteritoImperfectoRa', [
                    this.stem,
                    this.stem,
                    local,
                    this.stem,
                    this.stem,
                    this.stem
                ]);
            }
        }
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        if (this.version === '0') {
            this.setTable('Subjuntivo', 'PreteritoImperfectoSe');
        } else {
            if (this.region === 'formal') {
                this.setTable('Subjuntivo', 'PreteritoImperfectoSe', [
                    this.stem,
                    ...Array.from('12').map(() => this.stem.replace(/ac/, 'ugu')),
                    ...Array.from('345').map(() => this.stem)
                ]);
            } else {
                this.setTable('Subjuntivo', 'PreteritoImperfectoSe', [
                    ...Array.from('01').map(() => this.stem),
                    this.stem.replace(/ac/, 'ugu'),
                    ...Array.from('345').map(() => this.stem)
                ]);
            }
        }
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Subjuntivo', 'FuturoImperfecto');
        } else {
            if (this.region === 'formal') {
                this.setTable('Subjuntivo', 'FuturoImperfecto', [
                    this.stem,
                    ...Array.from('12').map(() => this.stem.replace(/ac/, 'ugu')),
                    ...Array.from('345').map(() => this.stem)
                ]);
            } else {
                this.setTable('Subjuntivo', 'FuturoImperfecto', [
                    ...Array.from('01').map(() => this.stem),
                    this.stem.replace(/ac/, 'ugu'),
                    ...Array.from('345').map(() => this.stem)
                ]);
            }
        }
    }

}

export class poder extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'u');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían'];
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.stem.replace(/o/, 'ue'), this.stem.replace(/o/, 'ue'));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/o/, 'ue'));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }
}
export class poner extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/on$/, 'us');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = 'go';
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['dré', 'drás', 'drá', 'dremos', 'dréis', 'drán'];
        this.desinences.Indicativo.CondicionalSimple = ['dría', 'drías', 'dría', 'dríamos', 'dríais', 'drían'];
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/onid/, 'uest');
        this.table.Impersonal.Participio = [this.participioCompuesto];
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }
    protected setSubjuntivoPresente(): void {
        const replace = this.stem.replace(/on$/, 'ong');
        this.setTable('Subjuntivo', 'Presente', Array.from('012345').map(() => replace));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }

    // Similar to the case of decir.Imp.Aff, the monos (there is just one, pon) and P, all drop their accents
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)p[oó]ne/, 'pon', 'pón');
    }
}

export class prever extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Participio[0] = this.desinences.Impersonal.Participio[0].replace(/d/, 'st');

        this.desinences.Indicativo.Presente[0] =
            this.desinences.Indicativo.Presente[0].replace(/^/, 'e');
        [1, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/^e/, 'é'));

        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Indicativo.PreteritoImperfecto[i] =
                this.desinences.Indicativo.PreteritoImperfecto[i].replace(/^/, 'e');

            this.desinences.Subjuntivo.Presente[i] =
                this.desinences.Subjuntivo.Presente[i].replace(/^/, 'e');
        });
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)v[eé]/, 've', 'vé');
    }
}

export class querer extends temer {
    private alteredStem: string;
    private secondAlteredArray: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ue/, 'uie');
        const secondAltered = this.stem.replace(/er$/, 'is');
        this.secondAlteredArray = Array.from('012345').map(() => secondAltered);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = ['ise', 'isiste', 'iso', 'isimos', 'isisteis', 'isieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían'];

    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/uer/, 'u');
        this.setTable('Indicativo', 'PreteritoIndefinido', Array.from('012345').map(() => local));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.secondAlteredArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.secondAlteredArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.secondAlteredArray);
    }
}

export class raer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.map(g => g.replace(/i/, 'y'));
        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.map(g => g.replace(/i/, 'í'));

        if (this.version === '0') {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'ig'));
        } else {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'y');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'y'));
        }

        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];

        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
        this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
        this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}

export class responder extends temer {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/sp.*/, 'p');
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = ['use', 'usiste', 'uso', 'usimos', 'usisteis', 'usieron'];
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido',
            Array.from('012345').map(() => this.alteredStem));
    }
}
export class roer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio =
            this.desinences.Impersonal.Gerundio.map(g => g.replace(/i/, 'y'));

        this.desinences.Impersonal.Participio =
            this.desinences.Impersonal.Participio.map(g => g.replace(/i/, 'í'));

        if (this.version === '1') {
            this.desinences.Indicativo.Presente[0] =
                this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');

            this.desinences.Subjuntivo.Presente =
                this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'ig'));

        } else if (this.version === '2') {
            this.desinences.Indicativo.Presente[0] =
                this.desinences.Indicativo.Presente[0].replace(/^/, 'y');

            this.desinences.Subjuntivo.Presente =
                this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'y'));
        }
        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
        this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
        this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}

export class romper extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Participio =
            [this.desinences.Impersonal.Participio[0].replace(/id/, '')];
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/mp/, 't');
        this.table.Impersonal.Participio = [this.participioCompuesto];
    }

}
export class saber extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ab/, 'up');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);

    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = '';

        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/í/, 'e');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');

        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Indicativo.FuturoImperfecto[i] =
                this.desinences.Indicativo.FuturoImperfecto[i].replace(/^e/, '');

            this.desinences.Indicativo.CondicionalSimple[i] =
                this.desinences.Indicativo.CondicionalSimple[i].replace(/^e/, '');
        });
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.stem.replace(/ab/, 'é'),
            this.stem,
            this.stem,
            this.stem,
            this.stem,
            this.stem
        ]);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }

    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/ab/, 'ep');
        this.setTable('Subjuntivo', 'Presente', [
            local,
            local,
            local,
            local,
            local,
            local,
        ]);
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }

}

export class ser extends temer {
    private alteredeStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredeStem = this.stem.replace(/s/, 'fu');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredeStem);
    }
    protected configDesinences(): void {
        this.desinences.Indicativo.Presente = ['soy', 'eres', 'es', 'somos', 'sois', 'son'];
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'sos';
        }
        this.desinences.Indicativo.PreteritoImperfecto = ['era', 'eras', 'era', 'éramos', 'erais', 'eran'];
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'i';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[5] = 'eron';
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `e${d}`);
        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, ''));
        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, ''));
        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', Array.from('012345').map(() => ''));
    }
    protected setIndicativoPreteritoImperfecto(): void {
        this.setTable('Indicativo', 'PreteritoImperfecto', Array.from('012345').map(() => ''));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region !== 'formal') {
            this.table.Imperativo.Afirmativo[1] =
                this.table.Imperativo.Afirmativo[1].replace(/(.*)\s+.*/, '$1 sé');
        }
    }
}

export class tañer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio =
            this.desinences.Impersonal.Gerundio.map(d => d.replace(/^i/, ''));

        this.desinences.Indicativo.PreteritoIndefinido[2] = 'ó';
        this.desinences.Indicativo.PreteritoIndefinido[5] = 'eron';

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
    }
}
export class tender extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class tener extends temer {
    private alteredStemArray: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        const alteredStem = this.stem.replace(/(.*)en/, '$1uv');
        this.alteredStemArray = Array.from('012345').map(() => alteredStem);
    }
    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] =
            this.desinences.Indicativo.Presente[0].replace(/^/, 'g');

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Indicativo.FuturoImperfecto[i] =
                this.desinences.Indicativo.FuturoImperfecto[i].replace(/^e/, 'd');

            this.desinences.Indicativo.CondicionalSimple[i] =
                this.desinences.Indicativo.CondicionalSimple[i].replace(/^e/, 'd');

            this.desinences.Subjuntivo.Presente[i] =
                this.desinences.Subjuntivo.Presente[i].replace(/^/, 'g');
        });
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.stem, this.stem.replace(/(.*)e/, '$1ie'));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.alteredStemArray);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.alteredStemArray);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)ti[eé]ne/, 'ten', 'tén');
    }
}
export class torcer extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o(r?)c/, 'ue$1z');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.stem.replace(/(.*)o/, '$1ue'));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem, this.stem.replace(/(.*)c/, '$1z'));
    }
}
export class traer extends temer {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        [0, 1].forEach(i => this.desinences.Impersonal.Gerundio[i] =
            this.desinences.Impersonal.Gerundio[i].replace(/^i/, 'y'));

        this.desinences.Impersonal.Participio[0] =
            this.desinences.Impersonal.Participio[0].replace(/^i/, 'í');

        this.desinences.Indicativo.Presente[0] =
            this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');

        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/í/, 'e');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');
        this.desinences.Indicativo.PreteritoIndefinido[5] =
            this.desinences.Indicativo.PreteritoIndefinido[5].replace(/i/, '');


        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Indicativo.PreteritoIndefinido[i] =
                this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^/, 'j');

            this.desinences.Subjuntivo.Presente[i] =
                this.desinences.Subjuntivo.Presente[i].replace(/^/, 'ig');

            this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
                this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/^i/, 'j');

            this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
                this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/^i/, 'j');

            this.desinences.Subjuntivo.FuturoImperfecto[i] =
                this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/^i/, 'j');
        });
    }
}

export class valer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] =
            this.desinences.Indicativo.Presente[0].replace(/^/, 'g');

        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Indicativo.FuturoImperfecto[i] =
                this.desinences.Indicativo.FuturoImperfecto[i].replace(/^e/, 'd');

            this.desinences.Indicativo.CondicionalSimple[i] =
                this.desinences.Indicativo.CondicionalSimple[i].replace(/^e/, 'd');

            this.desinences.Subjuntivo.Presente[i] =
                this.desinences.Subjuntivo.Presente[i].replace(/^/, 'g');
        });
    }
}

export class vencer extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'z');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array.from('12345').map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => this.alteredStem));
    }
}

export class ver extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/$/, 'e');
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Participio =
            [this.desinences.Impersonal.Participio[0].replace(/d/, 'st')];

        this.desinences.Indicativo.Presente[1] =
            this.desinences.Indicativo.Presente[1].replace(/é/, 'e');   // voseo
        this.desinences.Indicativo.Presente[4] =
            this.desinences.Indicativo.Presente[4].replace(/é/, 'e');

        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/í/, 'i');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ó/, 'o');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            this.stem,
            this.stem,
            this.stem,
            this.stem,
            this.stem
        ]);
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.setTable('Indicativo', 'PreteritoImperfecto', [
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem
        ]);
    }
    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', [
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem,
            this.alteredStem
        ]);
    }
}

export class volver extends temer {
    private alteredStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, '$1ue');
    }
    protected configDesinences(): void {
        this.desinences.Impersonal.Participio =
            [this.desinences.Impersonal.Participio[0].replace(/id/, 't')];
    }
    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/olv/, 'uel');
        this.table.Impersonal.Participio = [this.participioCompuesto];
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class yacer extends temer {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        switch (this.version) {
            case '0':
                this.alteredStem = this.stem.replace(/c$/, 'zc');
                break;
            case '1':
                this.alteredStem = this.stem.replace(/c$/, 'g');
                break;
            case '2':
            default:
                this.alteredStem = this.stem.replace(/c$/, 'zg');
                break;
        }
    }
    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array.from('12345').map(() => this.stem)]);
    }
    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => this.alteredStem));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version !== '0' && (this.region === 'canarias' || this.region === 'castellano')) {
            this.table.Imperativo.Afirmativo[1] =
                this.table.Imperativo.Afirmativo[1].replace(/ce$/, 'z');
        }
    }
}


