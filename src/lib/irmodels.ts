/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import { BaseModel, ModelAttributes, DesinenceTable } from './basemodel';
import { PronominalKey, Regions, SubjuntivoSubSimpleKey, IndicativoSubSimpleKey } from './types';


/* Do not export anything but classes from these model files, model factory depends on these exports */

// Temp arrays used to remap
const SIXARRAY = [0, 1, 2, 3, 4, 5];    // Use to remap all persons, etc
const FIVEARRAY = [1, 2, 3, 4, 5];      // Use to remap 5 persons or when the index itself doesn't matter!!!

const IR: Readonly<DesinenceTable> = {
    Impersonal: {
        Infinitivo: ['ir', 'irse'],
        Gerundio: ['iendo', 'iéndose'],
        Participio: ['ido']
    },
    Indicativo: {
        Presente: ['o', 'es', 'e', 'imos', 'ís', 'en'],
        PreteritoImperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
        PreteritoIndefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        FuturoImperfecto: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
        CondicionalSimple: ['iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían']
    },
    Subjuntivo: {
        Presente: ['a', 'as', 'a', 'amos', 'áis', 'an'],
        PreteritoImperfectoRa: ['iera', 'ieras', 'iera', 'iéramos', 'ierais', 'ieran'],
        PreteritoImperfectoSe: ['iese', 'ieses', 'iese', 'iésemos', 'ieseis', 'iesen'],
        FuturoImperfecto: ['iere', 'ieres', 'iere', 'iéremos', 'iereis', 'ieren']
    }
};

/* eslint-disable @typescript-eslint/class-name-casing */
export class partir extends BaseModel {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(IR));

        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = this.desinences.Indicativo.Presente[4].replace(/i/, '');
        }
        this.configDesinences();
        this.remapDesinencesByRegion();
    }

    protected configDesinences(): void { /* empty */ }
}

export class abrir extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/rid/, 'iert');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }
}


export class asir extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'g');

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.Presente[i] =
            this.desinences.Subjuntivo.Presente[i].replace(/^/, 'g'));
    }
}

export class adquirir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ir/, 'ier');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class argüir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        //                                \u00fc ===  ü                      
        this.alteredStem = this.stem.replace(/\u00fc/, 'u');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];

        [0, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            `y${this.desinences.Indicativo.Presente[i]}`);

        if (this.region !== 'voseo') {
            this.desinences.Indicativo.Presente[1] =
                `y${this.desinences.Indicativo.Presente[1]}`;
        }

        const pattern = /^i/;
        const alteredStem = 'y';
        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(pattern, alteredStem));

        SIXARRAY.forEach(i => {
            this.desinences.Subjuntivo.Presente[i] =
                `y${this.desinences.Subjuntivo.Presente[i]}`;

            this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
                this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(pattern, alteredStem);

            this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
                this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(pattern, alteredStem);

            this.desinences.Subjuntivo.FuturoImperfecto[i] =
                this.desinences.Subjuntivo.FuturoImperfecto[i].replace(pattern, alteredStem);
        });
    }

    protected setGerundio(): void {
        // change in stem from argü to argu. gerundio would get built as [argü] + 'iendo' 
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
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

// Really special - combination of partir & hablar
export class balbucir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'ce');
    }
    // balbucir takes some desinences from ir and others from ar
    protected configDesinences(): void {
        // Adopt desinences from AR
        this.desinences.Subjuntivo.Presente = ['e', 'es', 'e', 'emos', 'éis', 'en'];
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            SIXARRAY.map(() => this.alteredStem));
    }
}

export class bendecir extends partir {
    protected alteredStem: string;
    protected alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ec/, '');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido = [
            'e',
            'iste',
            'o',
            'imos',
            'isteis',
            'eron'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = [
            'ijera',
            'ijeras',
            'ijera',
            'ijéramos',
            'ijerais',
            'ijeran',
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoSe = [
            'ijese',
            'ijeses',
            'ijese',
            'ijésemos',
            'ijeseis',
            'ijesen',
        ];
        this.desinences.Subjuntivo.FuturoImperfecto = [
            'ijere',
            'ijeres',
            'ijere',
            'ijéremos',
            'ijereis',
            'ijeren',
        ];
    }

    protected setGerundio(): void {
        super.setGerundio(this.stem.replace(/dec/, 'dic'));
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.stem.replace(/ec/, 'ig'), this.stem.replace(/(.*)e/, '$1i'));
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const alteredStem = this.stem.replace(/ec/, 'ij');
        this.setTable('Indicativo', 'PreteritoIndefinido', SIXARRAY.map(() => alteredStem));
    }

    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/ec/, 'ig');
        this.setTable('Subjuntivo', 'Presente', SIXARRAY.map(() => alteredStem));
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

export class ceñir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected configDesinences(): void {
        [0, 1].forEach(i => this.desinences.Impersonal.Gerundio[i] =
            this.desinences.Impersonal.Gerundio[i].replace(/i/, ''));

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/i/, ''));
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
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

export class colegir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/eg/, 'ij');
        this.secondAlteredStemArray = SIXARRAY.map(() => this.secondAlteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
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

export class conducir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)c/, '$1zc');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)c/, '$1j');
        this.secondAlteredStemArray = SIXARRAY.map(() => this.secondAlteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/í/, 'e');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');
        this.desinences.Indicativo.PreteritoIndefinido[5] =
            this.desinences.Indicativo.PreteritoIndefinido[5].replace(/i/, '');

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/i/, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.secondAlteredStemArray);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.secondAlteredStemArray);
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.secondAlteredStemArray);
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.secondAlteredStemArray);
    }
}

// Write according to docs/decir.ods, 3 versions
export class decir extends bendecir {

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/ecid/, 'ich');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

    // where the ugly starts
    // Only for version 2
    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '2') {
            this.setTable('Indicativo', 'FuturoImperfecto');                           //  predeciré, antedeciré
        } else {
            this.setTable('Indicativo', 'FuturoImperfecto', this.alteredStemArray);    //  diré, prediré
        }
    }
    // Only for version 2
    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '2') {
            this.setTable('Indicativo', 'CondicionalSimple');
        } else {
            this.setTable('Indicativo', 'CondicionalSimple', this.alteredStemArray);    // diría, prediría
        }
    }
    // Only for version 0  (decir, redecir, entredecir: di, redí, entredí) see decir.ods document in env
    // decir imperative has no accent, all others do
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version === '0') {
            this.setImperativoAfirmativoMono(/(.*)d[ií]ce/, 'di', 'dí');
        }
    }
}

export class delinquir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/qu/, 'c');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', SIXARRAY.map(() => this.alteredStem));
    }
}

export class discernir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
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
export class distinguir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/u$/, '');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', SIXARRAY.map(() => this.alteredStem));
    }
}

export class dormir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, '$1u');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)o/, '$1ue');
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setParticipio(): void {
        super.setParticipio();
        const PR = this.attributes.PR as string;
        if (PR) {
            const [expression, alteredStem] = PR.split('/');
            this.participioCompuesto = this.participioCompuesto.replace(expression, alteredStem);
            this.table.Impersonal.Participio = this.participioCompuesto;
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.secondAlteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.secondAlteredStem, this.alteredStem);
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

export class embaír extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Infinitivo = ['ír', 'írse'];
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        this.desinences.Impersonal.Participio = ['ído'];
        this.desinences.Indicativo.Presente[0] = 'yo';
        this.desinences.Indicativo.Presente[3] = 'ímos';
        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            'íste',
            'yó',
            'ímos',
            'ísteis',
            'yeron'
        ];
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(t => `y${t}`);

        let pattern = /i/;
        let alteredStem = 'y';
        [0, 1, 2, 3, 5].forEach(i =>
            ['PreteritoImperfectoRa',
                'PreteritoImperfectoSe',
                'FuturoImperfecto'
            ].forEach(modeTime => this.desinences.Subjuntivo[modeTime as SubjuntivoSubSimpleKey][i] =
                this.desinences.Subjuntivo[modeTime as SubjuntivoSubSimpleKey][i].replace(pattern, alteredStem))
        );

        pattern = /ie/;
        alteredStem = 'yé';
        ['PreteritoImperfectoRa',
            'PreteritoImperfectoSe',
            'FuturoImperfecto'
        ].forEach(modeTime => this.desinences.Subjuntivo[modeTime as SubjuntivoSubSimpleKey][4] =
            this.desinences.Subjuntivo[modeTime as SubjuntivoSubSimpleKey][4].replace(pattern, alteredStem));
    }
}

export class erguir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private thirdAlteredStem: string;
    private thirdAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/^(.*)u/, 'y$1');
        this.secondAlteredStem = this.stem.replace(/^e(.*)u/, 'i$1');
        this.thirdAlteredStem = this.stem.replace(/^e/, 'i');
        this.thirdAlteredStemArray = SIXARRAY.map(() => this.thirdAlteredStem);

    }

    protected setGerundio(): void {
        super.setGerundio(this.thirdAlteredStem);
    }

    protected setIndicativoPresente(): void {
        if (this.version === '0') {
            this.setIndicativoPresentePattern125(this.alteredStem, this.stem.replace(/^/, 'y'));
        } else {
            this.setIndicativoPresentePattern125(this.secondAlteredStem, this.thirdAlteredStem);
        }
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.thirdAlteredStem);
    }

    protected setSubjuntivoPresente(): void {
        if (this.version === '0') {
            this.setSubjuntivoPresentePattern0125(this.alteredStem, this.secondAlteredStem);
        } else {
            this.setSubjuntivoPresentePattern0125(this.secondAlteredStem, this.secondAlteredStem);
        }
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.thirdAlteredStemArray);
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.thirdAlteredStemArray);
    }
    
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.thirdAlteredStemArray);
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'voseo' && this.version === '0') {
            this.table.Imperativo.Afirmativo[1] =
                this.table.Imperativo.Afirmativo[1].replace(/ergu.*/, (match: string) =>
                    match.endsWith('te') ? 'yérguete' : 'yergue');
        }
    }
}

export class escribir extends partir {
    private participioSecundario: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.participioSecundario = this.attributes.PS as string;
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Participio = [this.desinences.Impersonal.Participio[0].replace(/ido/, 'to')];
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem.replace(/b$/, '')}${this.desinences.Impersonal.Participio}`;
        if (this.participioSecundario) {
            const [searchValue, replaceValue] = this.participioSecundario.split('/');
            this.table.Impersonal.Participio = 
                `${this.participioCompuesto}/${this.participioCompuesto.replace(searchValue, replaceValue)}`;
        } else {
            this.table.Impersonal.Participio = this.participioCompuesto;
        }
    }
}

export class huir extends partir {

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio =
            this.desinences.Impersonal.Gerundio.map(g => g.replace(/^i/, 'y'));

        [0, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/^/, 'y'));

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/i/, 'y'));

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'y'));

        ['PreteritoImperfectoRa',
            'PreteritoImperfectoSe',
            'FuturoImperfecto'
        ].map(time => this.desinences.Subjuntivo[time as SubjuntivoSubSimpleKey] =
            this.desinences.Subjuntivo[time as SubjuntivoSubSimpleKey].map(d => d.replace(/^i/, 'y')));

        switch (this.region) {
            case 'castellano':
                this.desinences.Indicativo.Presente[1] =
                    this.desinences.Indicativo.Presente[1].replace(/^/, 'y');
                break;
            case 'formal':
                this.desinences.Indicativo.PreteritoIndefinido[1] =
                    this.desinences.Indicativo.PreteritoIndefinido[1].replace(/i/, 'y');
            // Intentional fall through
            case 'canarias':
                this.desinences.Indicativo.Presente[1] =
                    this.desinences.Indicativo.Presente[1].replace(/^/, 'y');
            // Intentional fall through
            case 'voseo':
                this.desinences.Indicativo.Presente[4] =
                    this.desinences.Indicativo.Presente[4].replace(/^/, 'y');
                this.desinences.Indicativo.PreteritoIndefinido[4] =
                    this.desinences.Indicativo.PreteritoIndefinido[4].replace(/i/, 'y');
        }
    }
}

export class imprimir extends partir {
    private participioDual: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.participioDual = this.attributes.PD as string;
    }

    protected setParticipio(): void {
        // participioDual always exists on imprimir verbs
        const [searchValue, replaceValue] = this.participioDual.split('/');
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`;
        this.participioCompuesto =
            `${this.participioCompuesto}/${this.participioCompuesto.replace(searchValue, replaceValue)}`;
        this.table.Impersonal.Participio = this.participioCompuesto;
    }
}

export class ir extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/$/, 'y');
        this.desinences.Indicativo.Presente[4] = this.desinences.Indicativo.Presente[4].replace(/./, 'ai');
        [1, 2, 3, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/./, 'a'));

        this.desinences.Indicativo.PreteritoImperfecto[3] =
            this.desinences.Indicativo.PreteritoImperfecto[3].replace(/./, 'íb');
        [0, 1, 2, 4, 5].forEach(i => this.desinences.Indicativo.PreteritoImperfecto[i] =
            this.desinences.Indicativo.PreteritoImperfecto[i].replace(/./, 'ib'));

        this.desinences.Indicativo.PreteritoIndefinido[0] =
            this.desinences.Indicativo.PreteritoIndefinido[0].replace(/./, 'i');
        this.desinences.Indicativo.PreteritoIndefinido[2] =
            this.desinences.Indicativo.PreteritoIndefinido[2].replace(/.*/, 'e');
        this.desinences.Indicativo.PreteritoIndefinido[5] =
            this.desinences.Indicativo.PreteritoIndefinido[5].replace(/./, '');


        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/./, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/./, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/./, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', SIXARRAY.map(() => 'v'));
    }
    
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', SIXARRAY.map(() => 'fu'));
    }
    
    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', SIXARRAY.map(() => 'vay'));
    }
    
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', SIXARRAY.map(() => 'fu'));
    }
    
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', SIXARRAY.map(() => 'fu'));
    }
    
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', SIXARRAY.map(() => 'fu'));
    }
    
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        switch (this.region) {
            case 'voseo':
                this.table.Imperativo.Afirmativo[1] =
                    this.table.Imperativo.Afirmativo[1].replace(/(.*)va.*/,
                        (m: string, p: string): string => m.endsWith('te') ? `${p}andate` : `${p}andá`);
                break;
            case 'castellano':
                this.table.Imperativo.Afirmativo[4] = this.table.Imperativo.Afirmativo[4].replace(/í/, 'id');
            // intentional fall through
            case 'canarias':
                this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/a/, 'e');
                break;
            default:
                break;
        }
    }
}

export class lucir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)c/, '$1zc');
    }

    // no longer needed as infecir was removed as unknown per la RAE
    // protected setParticipio(): void {
    //     super.setParticipio();
    //     const PR = this.attributes.PR as string;
    //     if (PR) {
    //         const [expression, alteredStem] = PR.split('/');
    //         this.participioCompuesto = this.participioCompuesto.replace(expression, alteredStem);
    //         this.table.Impersonal.Participio = this.participioCompuesto;
    //     }
    // }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            SIXARRAY.map(() => this.alteredStem));
    }
}

export class oír extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Infinitivo = ['ír', 'írse'];
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        this.desinences.Impersonal.Participio = ['ído'];
        this.desinences.Indicativo.Presente[0] = 'igo';
        this.desinences.Indicativo.Presente[3] = 'ímos';
        [1, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/^e/, 'ye'));

        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            'íste',
            'yó',
            'ímos',
            'ísteis',
            'yeron'
        ];
        SIXARRAY.forEach(i => this.desinences.Subjuntivo.Presente[i] =
            this.desinences.Subjuntivo.Presente[i].replace(/^/, 'ig'));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/^i/, 'y'));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/^i/, 'y'));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/^i/, 'y'));
    }
}

export class plañir extends partir {
    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        [0, 1].forEach(i => this.desinences.Impersonal.Gerundio[i] =
            this.desinences.Impersonal.Gerundio[i].replace(/^i/, ''));

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.Presente[i] =
            this.desinences.Subjuntivo.Presente[i].replace(/^i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoRa[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoRa[i].replace(/^i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.PreteritoImperfectoSe[i] =
            this.desinences.Subjuntivo.PreteritoImperfectoSe[i].replace(/^i/, ''));

        SIXARRAY.forEach(i => this.desinences.Subjuntivo.FuturoImperfecto[i] =
            this.desinences.Subjuntivo.FuturoImperfecto[i].replace(/^i/, ''));
    }
}

export class prohibir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
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

export class podrir extends partir {
    private alteredStem: string;
    protected alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'u');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'Presente',
                SIXARRAY.map(() => this.alteredStem));
        } else {
            if (this.region === 'castellano') {
                this.setTable('Indicativo', 'Presente', [
                    this.alteredStem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.stem,
                    this.alteredStem
                ]);
            } else {
                this.setTable('Indicativo', 'Presente', [
                    this.alteredStem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
            }
        }
    }

    protected setIndicativoPreteritoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoImperfecto', this.alteredStemArray);
        } else {
            this.setTable('Indicativo', 'PreteritoImperfecto');
        }
    }

    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
        } else {
            this.setTable('Indicativo', 'PreteritoIndefinido');
        }
    }

    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'FuturoImperfecto', this.alteredStemArray);
        } else {
            this.setTable('Indicativo', 'FuturoImperfecto');
        }
    }

    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'CondicionalSimple', this.alteredStemArray);
        } else {
            this.setTable('Indicativo', 'CondicionalSimple');
        }
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
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
        switch (this.region) {
            case 'castellano':
                if (this.version === '0') {
                    this.table.Imperativo.Afirmativo[4] =
                        this.table.Imperativo.Afirmativo[4].replace(/pod/, 'pud');
                }
                break;
            case 'voseo':
                if (this.version !== '0') {
                    this.table.Imperativo.Afirmativo[1] =
                        this.table.Imperativo.Afirmativo[1].replace(/pud/, 'pod');
                }
        }
    }
}

export class pudrir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/u/, 'o');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.alteredStem}${this.desinences.Impersonal.Participio}`;
        this.table.Impersonal.Participio = this.participioCompuesto;
    }

    protected setIndicativoPresente(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'Presente');
        } else {
            if (this.region === 'castellano') {
                this.setTable('Indicativo', 'Presente', [
                    this.stem,
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem
                ]);
            } else {
                this.setTable('Indicativo', 'Presente', [
                    this.stem,
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.stem
                ]);
            }
        }
    }

    protected setIndicativoPreteritoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoImperfecto');
        } else {
            this.setTable('Indicativo', 'PreteritoImperfecto', this.alteredStemArray);
        }
    }

    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoIndefinido');
        } else {
            this.setTable('Indicativo', 'PreteritoIndefinido', this.alteredStemArray);
        }
    }

    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'FuturoImperfecto');
        } else {
            this.setTable('Indicativo', 'FuturoImperfecto', this.alteredStemArray);
        }
    }

    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'CondicionalSimple');
        } else {
            this.setTable('Indicativo', 'CondicionalSimple', this.alteredStemArray);
        }
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version !== '0') {
            switch (this.region) {
                case 'castellano':
                    this.table.Imperativo.Afirmativo[4] =
                        this.table.Imperativo.Afirmativo[4].replace(/pud/, 'pod');
                    break;
                case 'voseo':
                    this.table.Imperativo.Afirmativo[1] =
                        this.table.Imperativo.Afirmativo[1].replace(/pud/, 'pod');
            }
        }
    }
}

export class rehenchir extends partir {
    protected alteredStem: string;
    protected alteredStemArray: string[];
    private secondAlteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)[ei]/, '$1í');
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }
    
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.secondAlteredStem);
    }
    
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.secondAlteredStem, this.alteredStem);
    }
    
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
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

// export class rehinchir extends rehenchir {
//     public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
//         super(verb, type, region, attributes);
//         this.alteredStem = this.stem;
//         this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
//     }
// }

export class rehuir extends huir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
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

export class reír extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private participioDual: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/e$/, '');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/e$/, 'í');
        this.participioDual = this.attributes.PD as string;
    }

    protected setParticipio(): void {
        if (this.participioDual) {
            const [searchValue, replaceValue] = this.participioDual.split('/');
            this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`;
            this.participioCompuesto =
                `${this.participioCompuesto}/${this.participioCompuesto.replace(searchValue, replaceValue)}`;
            this.table.Impersonal.Participio = this.participioCompuesto;
        } else {
            super.setParticipio();
        }
    }

    protected configDesinences(): void {
        this.desinences.Impersonal.Infinitivo = ['ír', 'írse'];
        this.desinences.Impersonal.Participio = ['ído'];
        this.desinences.Indicativo.Presente[3] = 'ímos';
        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            'íste',
            'ió',
            'ímos',
            'ísteis',
            'ieron'
        ];
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.secondAlteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        const localAltered = this.stem.replace(/e$/, 'i');
        this.setSubjuntivoPresentePattern0125(this.secondAlteredStem, localAltered);
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

export class reunir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
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

export class salir extends partir {
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        const alteredStem = this.stem.replace(/$/, 'd');
        this.alteredStemArray = SIXARRAY.map(() => alteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'g');
        ['FuturoImperfecto', 'CondicionalSimple'].forEach(modeTime => {
            this.desinences.Indicativo[modeTime as IndicativoSubSimpleKey] =
                this.desinences.Indicativo[modeTime as IndicativoSubSimpleKey].map(d => d.replace(/^i/, ''));
        });
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'g'));
    }
    
    protected setIndicativoFuturoImperfecto(): void {
        this.setTable('Indicativo', 'FuturoImperfecto', this.alteredStemArray);
    }
    
    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple', this.alteredStemArray);
    }
    // Similar to decir, venir, the monos 
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)s[aá]le/, 'sal', 'sal');
    }
}

export class seguir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStem: string;
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)egu/, '$1ig');
        this.secondAlteredStemArray = SIXARRAY.map(() => this.secondAlteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.alteredStem);
    }
    
    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
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

export class sentir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.secondAlteredStem, this.secondAlteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }
    
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.secondAlteredStem, this.alteredStem);
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

export class servir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern25(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
    }
    
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa',
            this.alteredStemArray);
    }
    
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe',
            this.alteredStemArray);
    }
    
    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.alteredStemArray);
    }
}


export class surgir extends partir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/g$/, 'j');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', SIXARRAY.map(() => this.alteredStem));
    }
}
export class venir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/en$/, 'ien');
        this.secondAlteredStem = this.stem.replace(/en$/, 'in');
        this.secondAlteredStemArray = SIXARRAY.map(() => this.secondAlteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'g');
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        ['FuturoImperfecto', 'CondicionalSimple'].forEach(modeTime => {
            this.desinences.Indicativo[modeTime as IndicativoSubSimpleKey] =
                this.desinences.Indicativo[modeTime as IndicativoSubSimpleKey].map(d => d.replace(/^i/, ''));
        });
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'g'));
    }

    protected setGerundio(): void {
        super.setGerundio(this.secondAlteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.stem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.secondAlteredStemArray);
    }

    protected setIndicativoFuturoImperfecto(): void {
        this.setTable('Indicativo', 'FuturoImperfecto',
            SIXARRAY.map(() => this.stem.replace(/$/, 'd')));
    }
    
    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple',
            SIXARRAY.map(() => this.stem.replace(/$/, 'd')));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', this.secondAlteredStemArray);
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', this.secondAlteredStemArray);
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', this.secondAlteredStemArray);
    }

    // Similar to decir, venir, the monos 
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        this.setImperativoAfirmativoMono(/(.*)vi[eé]ne/, 'ven', 'vén');
    }
}

export class zurcir extends partir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'z');
        this.alteredStemArray = SIXARRAY.map(() => this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...FIVEARRAY.map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', this.alteredStemArray);
    }
}
