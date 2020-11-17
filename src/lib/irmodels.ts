/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import {BaseModel, ModelAttributes, DesinenceTable} from './basemodel';
import {PronominalKey, Regions} from './types';


/* Do not export anything but classes from these model files, model factory depends on these exports */

// Temp arrays used to remap
const Array_6 = Array(6).fill('');
const Array_5 = Array(5).fill('');

/* eslint-disable @typescript-eslint/naming-convention */
export class partir extends BaseModel {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.desinences = this.initDesinences(region, reflexive);
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

    private initDesinences(region: Regions, reflexive: PronominalKey): DesinenceTable {
        return {
            Impersonal: {
                Infinitivo: reflexive !== 'P' ? 'ir' : 'irse',
                Gerundio: reflexive !== 'P' ? 'iendo' : 'iéndose',
                Participio: 'ido'
            },
            Indicativo: {
                Presente: ['o',
                    region !== 'voseo' ? (region !== 'formal' ? 'es' : 'e') : 'ís',
                    'e',
                    'imos',
                    region !== 'castellano' ? 'en' : 'ís',
                    'en'],
                PreteritoImperfecto: ['ía',
                    region !== 'formal' ? 'ías' : 'ía',
                    'ía',
                    'íamos',
                    region !== 'castellano' ? 'ían' : 'íais',
                    'ían'],
                PreteritoIndefinido: ['í',
                    region !== 'formal' ? 'iste' : 'ió',
                    'ió',
                    'imos',
                    region !== 'castellano' ? 'ieron' : 'isteis',
                    'ieron'],
                FuturoImperfecto: ['iré',
                    region !== 'formal' ? 'irás' : 'irá',
                    'irá',
                    'iremos',
                    region !== 'castellano' ? 'irán' : 'iréis',
                    'irán'],
                CondicionalSimple: ['iría',
                    region !== 'formal' ? 'irías' : 'iría',
                    'iría',
                    'iríamos',
                    region !== 'castellano' ? 'irían' : 'iríais',
                    'irían']
            },
            Subjuntivo: {
                Presente: ['a',
                    region === 'formal' ? 'a' : 'as',
                    'a',
                    'amos',
                    region === 'castellano' ? 'áis' : 'an',
                    'an'],
                PreteritoImperfectoRa: ['iera',
                    region === 'formal' ? 'iera' : 'ieras',
                    'iera',
                    'iéramos',
                    region === 'castellano' ? 'ierais' : 'ieran',
                    'ieran'],
                PreteritoImperfectoSe: ['iese',
                    region === 'formal' ? 'iese' : 'ieses',
                    'iese',
                    'iésemos',
                    region === 'castellano' ? 'ieseis' : 'iesen',
                    'iesen'],
                FuturoImperfecto: ['iere',
                    region === 'formal' ? 'iere' : 'ieres',
                    'iere',
                    'iéremos',
                    region === 'castellano' ? 'iereis' : 'ieren',
                    'ieren']
            }
        };
    }
}

export class abrir extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
    }

    protected setParticipio(): void {
        this.participioCompuesto = `${this.stem}${this.desinences.Impersonal.Participio}`.replace(/rid/, 'iert');
        this.table.Impersonal.Participio = this.participioCompuesto;
    }
}

export class asir extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.desinences.Indicativo.Presente[0] = 'go';

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `g${d}`);
    }
}

export class adquirir extends partir {
    private alteredStem: string;

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        //                                \u00fc ===  ü                      
        this.alteredStem = this.stem.replace(/\u00fc/, 'u');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);

        this.desinences.Impersonal.Gerundio = reflexive !== 'P' ? 'yendo' : 'yéndose';

        [0, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            `y${this.desinences.Indicativo.Presente[i]}`);

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^i/, 'y'));

        if (region !== 'castellano') {
            this.desinences.Indicativo.Presente[4] =
                `y${this.desinences.Indicativo.Presente[4]}`;
            this.desinences.Indicativo.PreteritoIndefinido[4] =
                this.desinences.Indicativo.PreteritoIndefinido[4].replace(/^i/, 'y');
        }

        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] =
                this.desinences.Indicativo.PreteritoIndefinido[1].replace(/^i/, 'y');
        }

        if (this.region !== 'voseo') {
            this.desinences.Indicativo.Presente[1] =
                `y${this.desinences.Indicativo.Presente[1]}`;
        }

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `y${d}`);

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, 'y'));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, 'y'));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, 'y'));
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'ce');

        // balbucir takes some desinences from ir and others from ar
        // Adopt desinences from AR
        this.desinences.Subjuntivo.Presente = ['e',
            region !== 'formal' ? 'es' : 'e',
            'e',
            'emos',
            region !== 'castellano' ? 'en' : 'éis',
            'en'];
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
}

export class bendecir extends partir {
    protected alteredStem: string;
    protected alteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/ec/, '');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);

        this.desinences.Indicativo.PreteritoIndefinido = [
            'e',
            region !== 'formal' ? 'iste' : 'o',
            'o',
            'imos',
            region !== 'castellano' ? 'eron' : 'isteis',
            'eron'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = [
            'ijera',
            region !== 'formal' ? 'ijeras' : 'ijera',
            'ijera',
            'ijéramos',
            region !== 'castellano' ? 'ijeran' : 'ijerais',
            'ijeran',
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoSe = [
            'ijese',
            region !== 'formal' ? 'ijeses' : 'ijese',
            'ijese',
            'ijésemos',
            region !== 'castellano' ? 'ijesen' : 'ijeseis',
            'ijesen',
        ];
        this.desinences.Subjuntivo.FuturoImperfecto = [
            'ijere',
            region !== 'formal' ? 'ijeres' : 'ijere',
            'ijere',
            'ijéremos',
            region !== 'castellano' ? 'ijeren' : 'ijereis',
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
        this.setTable('Indicativo', 'PreteritoIndefinido', Array_6.map(() => alteredStem));
    }

    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/ec/, 'ig');
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => alteredStem));
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);

        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/^i/, '');

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^i/, ''));

        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] =
                this.desinences.Indicativo.PreteritoIndefinido[4].replace(/^i/, '');
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] =
                    this.desinences.Indicativo.PreteritoIndefinido[1].replace(/^i/, '');
            }
        }

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
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

export class cohibir extends partir {
    private alteredStem: string;

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)i/, '$1í');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class conducir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)c/, '$1zc');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)c/, '$1j');
        this.secondAlteredStemArray = Array_6.map(() => this.secondAlteredStem);

        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';

        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] = 'eron';
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
            }
        }
        this.desinences.Indicativo.PreteritoIndefinido[5] = 'eron';

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/i/, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/i/, ''));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/i/, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)]);
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

export class corregir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/eg/, 'ij');
        this.secondAlteredStemArray = Array_6.map(() => this.secondAlteredStem);
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

// Write according to docs/decir.ods, 3 versions
export class decir extends bendecir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/qu/, 'c');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => this.alteredStem));
    }
}

export class dirigir extends partir {
    private alteredStem: string;

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/g$/, 'j');
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

export class discernir extends partir {
    private alteredStem: string;

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/u$/, '');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array_5.map(() => this.stem)
        ]);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => this.alteredStem));
    }
}

export class dormir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)o/, '$1u');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)o/, '$1ue');
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

export class embaír extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.desinences.Impersonal.Infinitivo = reflexive !== 'P' ? 'ír' : 'írse';
        this.desinences.Impersonal.Gerundio = reflexive !== 'P' ? 'yendo' : 'yéndose';
        this.desinences.Impersonal.Participio = 'ído';
        this.desinences.Indicativo.Presente[0] = 'yo';
        this.desinences.Indicativo.Presente[3] = 'ímos';
        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            region !== 'formal' ? 'íste' : 'yó',
            'yó',
            'ímos',
            region !== 'castellano' ? 'yeron' : 'ísteis',
            'yeron'
        ];
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `y${d}`);

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map((d, i) =>
                i === 4 && region === 'castellano' ?
                    d.replace(/^ie/, 'yé') :
                    d.replace(/^i/, 'y'));
        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map((d, i) =>
                i === 4 && region === 'castellano' ?
                    d.replace(/^ie/, 'yé') :
                    d.replace(/^i/, 'y'));
        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map((d, i) =>
                i === 4 && region === 'castellano' ?
                    d.replace(/^ie/, 'yé') :
                    d.replace(/^i/, 'y'));
    }
}

export class erguir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private thirdAlteredStem: string;
    private thirdAlteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/^(.*)u/, 'y$1');
        this.secondAlteredStem = this.stem.replace(/^e(.*)u/, 'i$1');
        this.thirdAlteredStem = this.stem.replace(/^e/, 'i');
        this.thirdAlteredStemArray = Array_6.map(() => this.thirdAlteredStem);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.participioSecundario = this.attributes.PS as string;
        this.desinences.Impersonal.Participio = 'to';
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
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);

        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/^i/, 'y');

        [0, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            `y${this.desinences.Indicativo.Presente[i]}`);

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^i/, 'y'));

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `y${d}`);

        switch (this.region) {
            case 'castellano':
                this.desinences.Indicativo.Presente[1] =
                    `y${this.desinences.Indicativo.Presente[1]}`;
                break;
            case 'formal':
                this.desinences.Indicativo.PreteritoIndefinido[1] =
                    this.desinences.Indicativo.PreteritoIndefinido[1].replace(/i/, 'y');
            // Intentional fall through
            case 'canarias':
                this.desinences.Indicativo.Presente[1] =
                    `y${this.desinences.Indicativo.Presente[1]}`;
            // Intentional fall through
            case 'voseo':
                this.desinences.Indicativo.Presente[4] =
                    `y${this.desinences.Indicativo.Presente[4]}`;
                this.desinences.Indicativo.PreteritoIndefinido[4] =
                    this.desinences.Indicativo.PreteritoIndefinido[4].replace(/i/, 'y');
        }

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, 'y'));
        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, 'y'));
        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, 'y'));

        // 2010 orthography
        if (typeof this.attributes['M'] !== 'undefined' && this.attributes['M'] === 'true') {
            if (this.region === 'voseo') {
                this.desinences.Indicativo.Presente[1] = 'is';
            }
            if (this.region === 'castellano') {
                this.desinences.Indicativo.Presente[4] = 'is';
            }
            this.desinences.Indicativo.PreteritoIndefinido[0] = 'i';
        }
    }
}

export class ir extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);

        this.desinences.Impersonal.Gerundio = reflexive !== 'P' ? 'yendo' : 'yéndose';
        this.desinences.Indicativo.Presente = ['oy',
            region !== 'formal' ? 'as' : 'a',
            'a',
            'amos',
            region !== 'castellano' ? 'an' : 'ais',
            'an'
        ];

        this.desinences.Indicativo.PreteritoImperfecto[3] =
            this.desinences.Indicativo.PreteritoImperfecto[3].replace(/./, 'íb');
        [0, 1, 2, 4, 5].forEach(i => this.desinences.Indicativo.PreteritoImperfecto[i] =
            this.desinences.Indicativo.PreteritoImperfecto[i].replace(/./, 'ib'));

        this.desinences.Indicativo.PreteritoIndefinido = ['i',
            region !== 'formal' ? 'iste' : 'e',
            'e',
            'imos',
            region !== 'castellano' ? 'eron' : 'isteis',
            'eron'
        ];

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^./, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^./, ''));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^./, ''));
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', Array_6.map(() => 'v'));
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', Array_6.map(() => 'fu'));
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array_6.map(() => 'vay'));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa', Array_6.map(() => 'fu'));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe', Array_6.map(() => 'fu'));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto', Array_6.map(() => 'fu'));
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)c/, '$1zc');
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

export class oír extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);

        this.desinences.Impersonal.Infinitivo = reflexive !== 'P' ? 'ír' : 'írse';
        this.desinences.Impersonal.Gerundio = reflexive !== 'P' ? 'yendo' : 'yéndose';
        this.desinences.Impersonal.Participio = 'ído';

        this.desinences.Indicativo.Presente[0] = 'igo';
        this.desinences.Indicativo.Presente[3] = 'ímos';

        [1, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] =
            this.desinences.Indicativo.Presente[i].replace(/^e/, 'ye'));
        if (region !== 'castellano') {
            this.desinences.Indicativo.Presente[4] =
                this.desinences.Indicativo.Presente[4].replace(/^e/, 'ye');
        }

        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            region !== 'formal' ? 'íste' : 'yó',
            'yó',
            'ímos',
            region !== 'castellano' ? 'yeron' : 'ísteis',
            'yeron'
        ];
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `ig${d}`);

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, 'y'));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, 'y'));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, 'y'));
    }
}

export class plañir extends partir {
    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);

        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.replace(/^i/, '');

        [2, 5].forEach(i => this.desinences.Indicativo.PreteritoIndefinido[i] =
            this.desinences.Indicativo.PreteritoIndefinido[i].replace(/^i/, ''));

        if (region !== 'castellano') {
            this.desinences.Indicativo.PreteritoIndefinido[4] =
                this.desinences.Indicativo.PreteritoIndefinido[4].replace(/^i/, '');
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] =
                    this.desinences.Indicativo.PreteritoIndefinido[1].replace(/^i/, '');
            }
        }

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoRa =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
    }
}

export class podrir extends partir {
    private alteredStem: string;
    protected alteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'u');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'Presente',
                Array_6.map(() => this.alteredStem));
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/u/, 'o');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
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

export class rehuir extends huir {
    private alteredStem: string;

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/e$/, '');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/e$/, 'í');

        // 2010 orthography
        const is2010 = typeof this.attributes['M'] !== 'undefined' &&
            this.attributes['M'] === 'true';

        this.desinences.Impersonal.Infinitivo = reflexive !== 'P' ? 'ír' : 'írse';
        this.desinences.Impersonal.Participio = 'ído';
        this.desinences.Indicativo.Presente[3] = 'ímos';
        this.desinences.Indicativo.PreteritoIndefinido = [
            'í',
            region !== 'formal' ? 'íste' : is2010 ? 'io' : 'ió',
            is2010 ? 'io' : 'ió',
            'ímos',
            region !== 'castellano' ? 'ieron' : 'ísteis',
            'ieron'
        ];

        if (is2010 && region === 'castellano') {
            this.desinences.Subjuntivo.Presente[4] = 'ais';
        }
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        const alteredStem = this.stem.replace(/$/, 'd');
        this.alteredStemArray = Array_6.map(() => alteredStem);

        this.desinences.Indicativo.Presente[0] =
            `g${this.desinences.Indicativo.Presente[0]}`;

        this.desinences.Indicativo.FuturoImperfecto =
            this.desinences.Indicativo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
        this.desinences.Indicativo.CondicionalSimple =
            this.desinences.Indicativo.CondicionalSimple.map(d => d.replace(/^i/, ''));
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `g${d}`);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/(.*)egu/, '$1ig');
        this.secondAlteredStemArray = Array_6.map(() => this.secondAlteredStem);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array_6.map(() => this.alteredStem);
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

export class venir extends partir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private secondAlteredStemArray: string[];

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/en$/, 'ien');
        this.secondAlteredStem = this.stem.replace(/en$/, 'in');
        this.secondAlteredStemArray = Array_6.map(() => this.secondAlteredStem);

        this.desinences.Indicativo.Presente[0] =
            `g${this.desinences.Indicativo.Presente[0]}`;
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';

        if (region === 'formal') {
            this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
        }
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';

        this.desinences.Indicativo.CondicionalSimple =
            this.desinences.Indicativo.CondicionalSimple.map(d => d.replace(/^i/, ''));
        this.desinences.Indicativo.FuturoImperfecto =
            this.desinences.Indicativo.FuturoImperfecto.map(d => d.replace(/^i/, ''));

        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `g${d}`);
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
            Array_6.map(() => `${this.stem}d`));
    }

    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple',
            Array_6.map(() => `${this.stem}d`));
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

    public constructor(verb: string, reflexive: PronominalKey, region: Regions, attributes: ModelAttributes) {
        super(verb, reflexive, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'z');
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
