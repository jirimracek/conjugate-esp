/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import {BaseModel, ModelAttributes, DesinenceTable} from './basemodel';
import {Regions} from './types';

/* Do not export anything but classes from these model files, model factory depends on these exports */

const Array_2 = Array(2).fill('');
const Array_3 = Array(3).fill('');
const Array_5 = Array(5).fill('');
const Array_6 = Array(6).fill('');

// Repeated desinence patterns
// caber, hacer,  haber, poder, poner, querer
const commonHaberIndicativoFuturoImperfecto = (region: Regions): Array<string> => {
    return ['ré',
        region !== 'formal' ? 'rás' : 'rá',
        'rá',
        'remos',
        region !== 'castellano' ? 'rán' : 'réis',
        'rán'
    ];
};

// caber, hacer, haber, poder, poner, querer
const commonHaberIndicativoCondicionalSimple = (region: Regions): Array<string> => {
    return ['ría',
        region !== 'formal' ? 'rías' : 'ría',
        'ría',
        'ríamos',
        region !== 'castellano' ? 'rían' : 'ríais',
        'rían'
    ];
};

// caer, corroer, creer, raer
const commonCaerIndicativoPreteritoIndefinido = (region: Regions): Array<string> => {
    return ['í',
        region !== 'formal' ? 'íste' : 'yó',
        'yó',
        'ímos',
        region !== 'castellano' ? 'yeron' : 'ísteis',
        'yeron'
    ];
};
// caer, corroer, creer, raer
const commonCaerSubjuntivoPreteritoImperfectoRa = (region: Regions): Array<string> => {
    return ['yera',
        region !== 'formal' ? 'yeras' : 'yera',
        'yera',
        'yéramos',
        region !== 'castellano' ? 'yeran' : 'yerais',
        'yeran'
    ];
};

// caer, corroer, creer, raer
const commonCaerSubjuntivoPreteritoImperfectoSe =
    (region: Regions): Array<string> =>
        commonCaerSubjuntivoPreteritoImperfectoRa(region).map(d => d.replace(/ra/, 'se'));

// caer, corroer, creer, raer
const commonCaerSubjuntivoFuturoImperfecto =
    (region: Regions): Array<string> =>
        commonCaerSubjuntivoPreteritoImperfectoRa(region).map(d => d.replace(/ra/, 're'));

/* eslint-disable @typescript-eslint/naming-convention */
export class temer extends BaseModel {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences = this.initDesinences(region);
    }

    protected setParticipio(): void {
        super.setParticipio();
        const PR = this.attributes['PR'] as string;
        if (PR) {
            const [expression, alteredStem] = PR.split('/');
            this.participioCompuesto = this.participioCompuesto.replace(expression, alteredStem);
            this.table.Impersonal.Participio = this.participioCompuesto;
        }
    }

    // Initialize termination table, map er terminations to the base
    private initDesinences(region: Regions): DesinenceTable {
        return {
            Impersonal: {
/* eslint-disable indent   */
/* 0  */   Infinitivo: !this.reflexive ? 'er': 'erse',
/* 1  */   Gerundio: !this.reflexive ? 'iendo':  'iéndose',
/* 2  */   Participio: 'ido'
                /*    */
            },
/*    */Indicativo: {
/* 3  */   Presente: ['o',
/* 4  */        region !== 'voseo' ? (region !== 'formal' ? 'es' : 'e') : 'és',
/* 5  */        'e',
/* 6  */        'emos',
/* 7  */        region !== 'castellano' ? 'en' : 'éis',
/* 8  */        'en'],
/* 9  */   PreteritoImperfecto: ['ía',
/* 10 */        region !== 'formal' ? 'ías' : 'ía',
/* 11 */         'ía',
/* 12 */         'íamos',
/* 13 */         region !== 'castellano' ? 'ían' : 'íais',
/* 14 */         'ían'],
/* 15 */   PreteritoIndefinido: ['í',
/* 16 */         region !== 'formal' ? 'iste' : 'ió',
/* 17 */         'ió',
/* 18 */         'imos',
/* 19 */         region !== 'castellano' ? 'ieron' : 'isteis',
/* 20 */         'ieron'],
/* 21 */   FuturoImperfecto: ['eré',
/* 22 */         region !== 'formal' ? 'erás' : 'erá',
/* 23 */         'erá',
/* 24 */         'eremos',
/* 25 */         region !== 'castellano' ? 'erán' : 'eréis',
/* 26 */         'erán'],
/* 27 */   CondicionalSimple: ['ería',
/* 28 */         region !== 'formal' ? 'erías' : 'ería',
/* 29 */         'ería',
/* 30 */         'eríamos',
/* 31 */         region !== 'castellano' ? 'erían' : 'eríais',
/* 32 */          'erían']
                /*    */
            },
/*    */Subjuntivo: {
/* 63 */   Presente: ['a',
/* 64 */       region !== 'formal' ? 'as' : 'a',
/* 65 */       'a',
/* 66 */       'amos',
/* 67 */       region !== 'castellano' ? 'an' : 'áis',
/* 68 */       'an'],
/* 69 */   PreteritoImperfectoRa: ['iera',
/* 70 */       region !== 'formal' ? 'ieras' : 'iera',
/* 71 */       'iera',
/* 72 */       'iéramos',
/* 73 */       region !== 'castellano' ? 'ieran' : 'ierais',
/* 74 */       'ieran'],
/* 75 */   PreteritoImperfectoSe: ['iese',
/* 76 */       region !== 'formal' ? 'ieses' : 'iese',
/* 77 */       'iese',
/* 78 */       'iésemos',
/* 79 */       region !== 'castellano' ? 'iesen' : 'ieseis',
/* 80 */       'iesen'],
/* 81 */   FuturoImperfecto: ['iere',
/* 82 */       region !== 'formal' ? 'ieres' : 'iere',
/* 83 */       'iere',
/* 84 */       'iéremos',
/* 85 */       region !== 'castellano' ? 'ieren' : 'iereis',
/* 86 */       'ieren']
                /*    */
            }
        };
    }
}

/* eslint-enable indent */
export class caber extends temer {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/ab/, 'up');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/.*/, 'quep');
        this.secondAlteredStemArray = Array_6.map(() => this.secondAlteredStem);

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }

        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.secondAlteredStem,
            ...Array_5.map(() => this.stem)
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
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = !this.reflexive ? 'yendo' : 'yéndose';
        this.desinences.Impersonal.Participio = 'ído';
        this.desinences.Indicativo.Presente[0] = `ig${this.desinences.Indicativo.Presente[0]}`;

        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => `ig${d}`);

        this.desinences.Indicativo.PreteritoIndefinido = commonCaerIndicativoPreteritoIndefinido(region);
        this.desinences.Subjuntivo.PreteritoImperfectoRa = commonCaerSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = commonCaerSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = commonCaerSubjuntivoFuturoImperfecto(region);
    }
}

export class coger extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/g$/, 'j');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
    }
}

export class corroer extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/i/, 'y');

        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.replace(/i/, 'í');

        if (this.version === '1') {
            this.desinences.Indicativo.Presente[0] = `ig${this.desinences.Indicativo.Presente[0]}`;
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => `ig${d}`);

        } else if (this.version === '2') {
            this.desinences.Indicativo.Presente[0] = `y${this.desinences.Indicativo.Presente[0]}`;
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => `y${d}`);
        }
        this.desinences.Indicativo.PreteritoIndefinido = commonCaerIndicativoPreteritoIndefinido(region);

        this.desinences.Subjuntivo.PreteritoImperfectoRa = commonCaerSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = commonCaerSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = commonCaerSubjuntivoFuturoImperfecto(region);
    }
}

export class creer extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/i/, 'y');
        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.replace(/i/, 'í');

        this.desinences.Indicativo.PreteritoIndefinido = commonCaerIndicativoPreteritoIndefinido(region);
        this.desinences.Subjuntivo.PreteritoImperfectoRa = commonCaerSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = commonCaerSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = commonCaerSubjuntivoFuturoImperfecto(region);
    }
}

export class hacer extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/acid/, 'ech');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.stem.replace(/c$/, 'g'),
            ...Array_5.map(() => this.stem)]);
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
        this.setTable('Indicativo', 'FuturoImperfecto', Array_6.map(() => local));
    }

    protected setIndicativoCondicionalSimple(): void {
        const local = this.stem.replace(/c$/, '');
        this.setTable('Indicativo', 'CondicionalSimple', Array_6.map(() => local));
    }

    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/c$/, 'g');
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => local));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', Array_6.map(() => local));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', Array_6.map(() => local));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        const local = this.stem.replace(/(.*)a/, '$1i');
        this.setTable('Subjuntivo', 'FuturoImperfecto', Array_6.map(() => local));
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
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);

        this.desinences.Indicativo.Presente = ['e',
            region !== 'formal' ? 'as' : 'a',
            'a',
            'emos',
            region !== 'castellano' ? 'an' : 'éis',
            'an'
        ];

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';

        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
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
                this.setTable('Indicativo', 'Presente', Array_6.map(() => local));
                break;
        }
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Indicativo', 'PreteritoIndefinido', Array_6.map(() => local));
    }

    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/b/, 'y');
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => local));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', Array_6.map(() => local));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', Array_6.map(() => local));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        const local = this.stem.replace(/a/, 'u');
        this.setTable('Subjuntivo', 'FuturoImperfecto', Array_6.map(() => local));
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region !== 'formal') {
            this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/a/, 'e');
        }
    }
}

export class mover extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/s?c$/, 'zc');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => this.alteredStem));
    }
}

export class oler extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'zc');

        if (this.version === '1') {
            this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
            }
        }
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)]);
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
                Array_6.map(() => this.alteredStem));
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
                    ...Array_2.map(() => this.stem.replace(/ac/, 'ugu')),
                    ...Array_3.map(() => this.stem)
                ]);
            } else {
                this.setTable('Subjuntivo', 'PreteritoImperfectoSe', [
                    ...Array_2.map(() => this.stem),
                    this.stem.replace(/ac/, 'ugu'),
                    ...Array_3.map(() => this.stem)
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
                    ...Array_2.map(() => this.stem.replace(/ac/, 'ugu')),
                    ...Array_3.map(() => this.stem)
                ]);
            } else {
                this.setTable('Subjuntivo', 'FuturoImperfecto', [
                    ...Array_2.map(() => this.stem),
                    this.stem.replace(/ac/, 'ugu'),
                    ...Array_3.map(() => this.stem)
                ]);
            }
        }
    }

}

export class poder extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'u');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
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
    private secondAlteredStemArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/on$/, 'us');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        const second = this.stem.replace(/$/, 'd');
        this.secondAlteredStemArray = Array_6.map(() => second);


        this.desinences.Indicativo.Presente[0] = 'go';
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/onid/, 'uest');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }

    protected setIndicativoFuturoImperfecto(): void {
        this.setTable('Indicativo', 'FuturoImperfecto', this.secondAlteredStemArray);
    }

    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple', this.secondAlteredStemArray);
    }

    protected setSubjuntivoPresente(): void {
        const replace = this.stem.replace(/on$/, 'ong');
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => replace));
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

export class rever extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Participio = 'isto';

        this.desinences.Indicativo.Presente[0] = 'eo';
        this.desinences.Indicativo.Presente[1] = region === 'formal' ? 'é' : 'és';
        this.desinences.Indicativo.Presente[2] = 'é';
        if (region !== 'castellano') {
            this.desinences.Indicativo.Presente[4] = 'én';
        }
        this.desinences.Indicativo.Presente[5] = 'én';

        // Prepend e to all of these
        this.desinences.Indicativo.PreteritoImperfecto =
            this.desinences.Indicativo.PreteritoImperfecto.map(d => `e${d}`);

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `e${d}`);

    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)v[eé]/, 've', 'vé');
    }
}

export class querer extends temer {
    private alteredStem: string;
    private secondAlteredArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/ue/, 'uie');
        const secondAltered = this.stem.replace(/er$/, 'is');
        this.secondAlteredArray = Array_6.map(() => secondAltered);

        this.desinences.Indicativo.PreteritoIndefinido = ['ise',
            region !== 'formal' ? 'isiste' : 'iso',
            'iso',
            'isimos',
            region !== 'castellano' ? 'isieron' : 'isisteis',
            'isieron'];
        this.desinences.Indicativo.FuturoImperfecto = commonHaberIndicativoFuturoImperfecto(region);
        this.desinences.Indicativo.CondicionalSimple = commonHaberIndicativoCondicionalSimple(region);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const local = this.stem.replace(/uer/, 'u');
        this.setTable('Indicativo', 'PreteritoIndefinido', Array_6.map(() => local));
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
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/i/, 'y');
        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.replace(/i/, 'í');

        if (this.version === '0') {
            this.desinences.Indicativo.Presente[0] = 'igo';
            this.desinences.Subjuntivo.Presente =
                this.desinences.Subjuntivo.Presente.map(d => `ig${d}`);
        } else {
            this.desinences.Indicativo.Presente[0] = 'yo';
            this.desinences.Subjuntivo.Presente =
                this.desinences.Subjuntivo.Presente.map(d => `y${d}`);
        }

        this.desinences.Indicativo.PreteritoIndefinido = commonCaerIndicativoPreteritoIndefinido(region);
        this.desinences.Subjuntivo.PreteritoImperfectoRa = commonCaerSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = commonCaerSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = commonCaerSubjuntivoFuturoImperfecto(region);
    }
}

export class responder extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/sp.*/, 'p');
        this.desinences.Indicativo.PreteritoIndefinido = ['use',
            region !== 'formal' ? 'usiste' : 'uso',
            'uso',
            'usimos',
            region !== 'castellano' ? 'usieron' : 'usisteis',
            'usieron'];
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido',
            Array_6.map(() => this.alteredStem));
    }
}

export class romper extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Participio = 'o';
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/mp/, 't');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

}
export class saber extends temer {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/ab/, 'up');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);

        this.desinences.Indicativo.Presente[0] = '';

        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';

        this.desinences.Indicativo.FuturoImperfecto =
            this.desinences.Indicativo.FuturoImperfecto.map(d => d.replace(/^e/, ''));

        this.desinences.Indicativo.CondicionalSimple =
            this.desinences.Indicativo.CondicionalSimple.map(d => d.replace(/^e/, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.stem.replace(/ab/, 'é'),
            ...Array_5.map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
    }

    protected setSubjuntivoPresente(): void {
        const local = this.stem.replace(/ab/, 'ep');
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => local));
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredeStem = this.stem.replace(/s/, 'fu');
        this.alteredStemArray = Array_6.map(() => this.alteredeStem);

        this.desinences.Indicativo.Presente = ['soy',
            region !== 'voseo' ? (region !== 'formal' ? 'eres' : 'es') : 'sos',
            'es',
            'somos',
            region !== 'castellano' ? 'son' : 'sois',
            'son'];

        this.desinences.Indicativo.PreteritoImperfecto = ['era',
            region !== 'formal' ? 'eras' : 'era',
            'era',
            'éramos',
            region !== 'castellano' ? 'eran' : 'erais',
            'eran'];

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'i';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'e';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'e';
        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] = 'eron';
        }
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
        this.setTable('Indicativo', 'Presente', Array_6.map(() => ''));
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.setTable('Indicativo', 'PreteritoImperfecto', Array_6.map(() => ''));
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
                this.table.Imperativo.Afirmativo[1].replace(/.*/, 'sé');
        }
    }
}

export class tañer extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/^i/, '');

        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'ó';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'ó';
        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] = 'eron';
        }
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        const alteredStem = this.stem.replace(/(.*)en/, '$1uv');
        this.alteredStemArray = Array_6.map(() => alteredStem);

        this.desinences.Indicativo.Presente[0] = 'go';

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';

        this.desinences.Indicativo.FuturoImperfecto =
            this.desinences.Indicativo.FuturoImperfecto.map(d => d.replace(/^e/, 'd'));
        this.desinences.Indicativo.CondicionalSimple =
            this.desinences.Indicativo.CondicionalSimple.map(d => d.replace(/^e/, 'd'));
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `g${d}`);
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/^i/, 'y');
        this.desinences.Impersonal.Participio = 'ído';

        this.desinences.Indicativo.Presente[0] = 'igo';

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] = 'eron';
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
            }
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        this.desinences.Indicativo.PreteritoIndefinido[5] = 'eron';
        this.desinences.Indicativo.PreteritoIndefinido =
            this.desinences.Indicativo.PreteritoIndefinido.map(d => `j${d}`);

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `ig${d}`);

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, 'j'));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, 'j'));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, 'j'));
    }
}

export class valer extends temer {
    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Indicativo.Presente[0] =
            `g${this.desinences.Indicativo.Presente[0]}`;

        this.desinences.Indicativo.FuturoImperfecto =
            this.desinences.Indicativo.FuturoImperfecto.map(d => d.replace(/^e/, 'd'));

        this.desinences.Indicativo.CondicionalSimple =
            this.desinences.Indicativo.CondicionalSimple.map(d => d.replace(/^e/, 'd'));

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `g${d}`);
    }
}

export class vencer extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'z');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => this.alteredStem));
    }
}

export class ver extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/$/, 'e');

        this.desinences.Impersonal.Participio = 'isto';
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'i';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'io';

        if (region === 'castellano') {
            this.desinences.Indicativo.Presente[4] = 'eis';
        } else if (region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'es';
        } else if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'io';
        }
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)
        ]);
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.setTable('Indicativo', 'PreteritoImperfecto',
            Array_6.map(() => this.alteredStem));
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => this.alteredStem));
    }
}

export class volver extends temer {
    private alteredStem: string;

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, '$1ue');
        this.desinences.Impersonal.Participio = 'to';
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/olv/, 'uel');
        this.table.Impersonal.Participio = this.participioCompuesto;
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

    public constructor(verb: string,  region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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
            ...Array_5.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => this.alteredStem));
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version !== '0' && (this.region === 'canarias' || this.region === 'castellano')) {
            this.table.Imperativo.Afirmativo[1] =
                this.table.Imperativo.Afirmativo[1].replace(/ce$/, 'z');
        }
    }
}


