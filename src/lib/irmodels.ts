/* eslint-disable @typescript-eslint/class-name-casing */
/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { IR, AR } from './declarations/constants';

export class vivir extends BaseModel {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(IR));
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = this.desinences.Indicativo.Presente[4].replace(/i/, '');
        }
        this.configDesinences();
        this.remapDesinencesByRegion();
    }

    protected configDesinences(): void { /* empty */ }

    // Repeated pattern of indicativo presente stem modifications
    // The matrix looks like this
    //     person: 0 1 2 3 4 5     
    // castellano: . . .     .
    //      voseo: .   .   . .
    //  can & for: . . .   . . 
    protected setIndicativoPresentePattern0125(alteredStem: string): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    this.stem,
                    alteredStem
                ]);
                break;
            case 'voseo':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    this.stem,
                    alteredStem,
                    this.stem,
                    alteredStem,
                    alteredStem
                ]);
                break;
            case 'canarias':
            // intentional fall through
            case 'formal':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    alteredStem,
                    alteredStem
                ]);
        }
    }
    // Corresponding subj. presente patterns
    //            person: 0 1 2 3 4 5     
    //        castellano: . . .     .
    // voseo & can & for: . . .   . . 
    // eslint-disable-next-line @typescript-eslint/camelcase
    protected setSubjuntivoPresentePattern0125(alteredStem: string): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Subjuntivo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    this.stem,
                    alteredStem
                ]);
                break;
            case 'voseo':
            // intentional fall through
            case 'canarias':
            // intentional fall through
            case 'formal':
                this.setTable('Subjuntivo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    alteredStem,
                    alteredStem
                ]);
        }
    }
}


export class abrir extends vivir {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio =
            [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/rid/, 'iert')];
        this.participioCompuesto =
            this.table.Impersonal.Participio[0];
    }
}

export class adquirir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/ir/, 'ier');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class argüir extends vivir {
    private alteredStem: string;
    private alteredStemArray: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        //                                \u00fc ===  ü                      
        this.alteredStem = this.stem.replace(/\u00fc/, 'u');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
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

        [0, 1, 2, 3, 4, 5].forEach(i => {
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
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.stem,
                    this.alteredStem
                ]);
                break;
            case 'voseo':
            // Intentional fall through 
            case 'canarias':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
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
}

// Really special - combination of vivir & amar
export class balbucir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'ce');
    }
    // balbucir takes some desinences from ir and others from ar
    protected configDesinences(): void {
        // Adopt desinences from AR
        this.desinences.Subjuntivo.Presente =
            JSON.parse(JSON.stringify(AR.Subjuntivo.Presente));
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
}

// Write according to docs/decir.ods, 3 versions
export class decir extends vivir {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
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
    protected setParticipio(): void {
        this.table.Impersonal.Participio =
            [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/ecid/, 'ich')];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }
    protected setIndicativoPresente(): void {
        const alteredStem = this.stem.replace(/ec/, 'ig');
        const secondAltered = this.stem.replace(/(.*)e/, '$1i');
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    secondAltered,
                    secondAltered,
                    this.stem,
                    this.stem,
                    secondAltered
                ]);
                break;
            case 'voseo':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    this.stem,
                    secondAltered,
                    this.stem,
                    secondAltered,
                    secondAltered
                ]);
                break;
            case 'canarias':
            case 'formal':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    secondAltered,
                    secondAltered,
                    this.stem,
                    secondAltered,
                    secondAltered
                ]);
                break;
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        const alteredStem = this.stem.replace(/ec/, 'ij');
        this.setTable('Indicativo', 'PreteritoIndefinido',
            Array.from('012345').map(() => alteredStem));
    }

    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/ec/, 'ig');
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => alteredStem));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const alteredStem = this.stem.replace(/ec/, '');
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa',
            Array.from('012345').map(() => alteredStem));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const alteredStem = this.stem.replace(/ec/, '');
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe',
            Array.from('012345').map(() => alteredStem));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        const alteredStem = this.stem.replace(/ec/, '');
        this.setTable('Subjuntivo', 'FuturoImperfecto',
            Array.from('012345').map(() => alteredStem));
    }

    // where the ugly starts
    // Only for version 2
    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '2') {
            this.setTable('Indicativo', 'FuturoImperfecto');                  //  predeciré, antedeciré
        } else {
            const alteredStem = this.stem.replace(/ec/, '');                   //  diré, prediré
            this.setTable('Indicativo', 'FuturoImperfecto',
                Array.from('012345').map(() => alteredStem));
        }
    }
    // Only for version 2
    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '2') {
            this.setTable('Indicativo', 'CondicionalSimple');
        } else {
            const alteredStem = this.stem.replace(/ec/, '');                    // diría, prediría
            this.setTable('Indicativo', 'CondicionalSimple',
                Array.from('012345').map(() => alteredStem));
        }
    }
    // Only for version 0  (decir, redecir, entredecir: di, redí, entredí) see decir.ods document in env
    // decir imperative has no accent, all others do
    // TODO: standardize
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version === '0') {
            this.setImperativoAfirmativoMono(/(.*)d[ií]ce/, 'di', 'dí');
        }
        // if (this.version === '0' && (this.region === 'castellano' || this.region === 'canarias')) {
        //     this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].
        //         replace(/(.*)d[ií]ce/, (match: string, p1: string): string => {
        //             // if p1 ends with a space (tú dice: p1 ===  'tú ') 
        //             if (/\s+$/.test(p1) || this.type === 'P') return `${p1}di`;
        //             return `${p1}dí`;   //  else p1 didn't end with a space (tú redice: p1 === 'tú re')
        //         });
        // }
    }
}

export class discernir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class embaír extends vivir {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
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
        [0, 1, 2, 3, 5].forEach(i => {
            ['PreteritoImperfectoRa',
                'PreteritoImperfectoSe',
                'FuturoImperfecto'
            ].forEach(modeTime => {
                this.desinences.Subjuntivo[modeTime][i] =
                    this.desinences.Subjuntivo[modeTime][i].replace(pattern, alteredStem);
            });
        });
        pattern = /ie/;
        alteredStem = 'yé';
        ['PreteritoImperfectoRa',
            'PreteritoImperfectoSe',
            'FuturoImperfecto'
        ].forEach(modeTime => {
            this.desinences.Subjuntivo[modeTime][4] =
                this.desinences.Subjuntivo[modeTime][4].replace(pattern, alteredStem);
        });
    }
}

export class huir extends vivir {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
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
        ].map(time => this.desinences.Subjuntivo[time] =
            this.desinences.Subjuntivo[time].map(d => d.replace(/^i/, 'y')));

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

export class lucir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)c/, '$1zc');
    }

    protected setParticipio(): void {
        super.setParticipio();
        const PR = this.attributes['PR'] as string;
        if (PR) {
            const [expression, alteredStem] = PR.split('/');
            this.table.Impersonal.Participio[0] =
                this.table.Impersonal.Participio[0].replace(expression, alteredStem);

            this.participioCompuesto = this.table.Impersonal.Participio[0];
        }
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

export class podrir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'u');
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'Presente',
                Array.from('012345').map(() => this.alteredStem));
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
            this.setTable('Indicativo', 'PreteritoImperfecto',
                Array.from('012345').map(() => this.alteredStem));
        } else {
            this.setTable('Indicativo', 'PreteritoImperfecto');
        }
    }

    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoIndefinido',
                Array.from('012345').map(() => this.alteredStem));
        } else {
            this.setTable('Indicativo', 'PreteritoIndefinido');
        }
    }

    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'FuturoImperfecto',
                Array.from('012345').map(() => this.alteredStem));
        } else {
            this.setTable('Indicativo', 'FuturoImperfecto');
        }
    }
    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'CondicionalSimple',
                Array.from('012345').map(() => this.alteredStem));
        } else {
            this.setTable('Indicativo', 'CondicionalSimple');
        }
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array.from('012345').map(() => this.alteredStem));
    }

    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoRa',
            Array.from('012345').map(() => this.alteredStem));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.setTable('Subjuntivo', 'PreteritoImperfectoSe',
            Array.from('012345').map(() => this.alteredStem));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.setTable('Subjuntivo', 'FuturoImperfecto',
            Array.from('012345').map(() => this.alteredStem));
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

export class pudrir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/u/, 'o');
    }

    protected setParticipio(): void {
        this.table.Impersonal.Participio =
            [`${this.alteredStem}${this.desinences.Impersonal.Participio}`];
        this.participioCompuesto =
            this.table.Impersonal.Participio[0];
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
            this.setTable('Indicativo', 'PreteritoImperfecto',
                Array.from('012345').map(() => this.alteredStem));
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'PreteritoIndefinido');
        } else {
            this.setTable('Indicativo', 'PreteritoIndefinido',
                Array.from('012345').map(() => this.alteredStem));
        }
    }
    protected setIndicativoFuturoImperfecto(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'FuturoImperfecto');
        } else {
            this.setTable('Indicativo', 'FuturoImperfecto',
                Array.from('012345').map(() => this.alteredStem));
        }
    }
    protected setIndicativoCondicionalSimple(): void {
        if (this.version === '0') {
            this.setTable('Indicativo', 'CondicionalSimple');
        } else {
            this.setTable('Indicativo', 'CondicionalSimple',
                Array.from('012345').map(() => this.alteredStem));
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

export class reír extends vivir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/e$/, '');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
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
        const alteredStem = this.stem.replace(/e$/, 'í');
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    this.stem,
                    alteredStem
                ]);
                break;
            case 'voseo':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    this.stem,
                    alteredStem,
                    this.stem,
                    alteredStem,
                    alteredStem
                ]);
                break;
            case 'canarias':
            case 'formal':
                this.setTable('Indicativo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    this.stem,
                    alteredStem,
                    alteredStem
                ]);
        }
    }

    // TODO: repeated pattern???
    protected setIndicativoPreteritoIndefinido(): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.stem,
                    this.alteredStem
                ]);
                break;
            case 'voseo':
            case 'canarias':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
        }
    }
    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/e$/, 'í');
        const secondAltered = this.stem.replace(/e$/, 'i');
        switch (this.region) {
            case 'castellano':
                this.setTable('Subjuntivo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    secondAltered,
                    secondAltered,
                    alteredStem
                ]);
                break;
            case 'voseo':
                this.setTable('Subjuntivo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    secondAltered,
                    alteredStem,
                    alteredStem
                ]);
                break;
            case 'canarias':
            case 'formal':
                this.setTable('Subjuntivo', 'Presente', [
                    alteredStem,
                    alteredStem,
                    alteredStem,
                    secondAltered,
                    alteredStem,
                    alteredStem
                ]);
        }
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

export class surgir extends vivir {
    private alteredStem: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/g$/, 'j');
    }

    protected setIndicativoPresente(): void {
        this.setTable('Indicativo', 'Presente', [
            this.alteredStem,
            ...Array.from('12345').map(() => this.stem)]);
    }
    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente', Array.from('012345').map(() => this.alteredStem));
    }
}

export class servir extends vivir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1i');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
    }

    protected setGerundio(): void {
        super.setGerundio(this.alteredStem);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern0125(this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.stem,
                    this.alteredStem
                ]);
                break;
            case 'voseo':
            case 'canarias':

                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
            case 'formal':
                this.setTable('Indicativo', 'PreteritoIndefinido', [
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
        }
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

export class venir extends vivir {
    private alteredStem: string;
    private secondAlteredStem: string;
    private alteredStemArray: string[];
    private secondAlteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/en$/, 'ien');
        this.alteredStemArray = Array.from('012345').map(() => this.alteredStem);
        this.secondAlteredStem = this.stem.replace(/en$/, 'in');
        this.secondAlteredStemArray = Array.from('012345').map(() => this.secondAlteredStem);
    }

    protected configDesinences(): void {
        this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'g');
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        ['FuturoImperfecto', 'CondicionalSimple'].forEach(modeTime => {
            this.desinences.Indicativo[modeTime] =
                this.desinences.Indicativo[modeTime].map(d => d.replace(/^i/, ''));
        });
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'g'));

    }

    protected setGerundio(): void {
        super.setGerundio(this.secondAlteredStem);
    }

    protected setIndicativoPresente(): void {
        switch (this.region) {
            case 'castellano':
                this.setTable('Indicativo', 'Presente', [
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.stem,
                    this.alteredStem
                ]);
                break;
            case 'voseo':
                this.setTable('Indicativo', 'Presente', [
                    this.stem,
                    this.stem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
                break;
            case 'canarias':
            // intentional fall through
            case 'formal':
                this.setTable('Indicativo', 'Presente', [
                    this.stem,
                    this.alteredStem,
                    this.alteredStem,
                    this.stem,
                    this.alteredStem,
                    this.alteredStem
                ]);
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.setTable('Indicativo', 'PreteritoIndefinido', this.secondAlteredStemArray);
    }
    protected setIndicativoFuturoImperfecto(): void {
        this.setTable('Indicativo', 'FuturoImperfecto',
            Array.from('012345').map(() => this.stem.replace(/$/, 'd')));
    }
    protected setIndicativoCondicionalSimple(): void {
        this.setTable('Indicativo', 'CondicionalSimple',
            Array.from('012345').map(() => this.stem.replace(/$/, 'd')));
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

export class zurcir extends vivir {
    private alteredStem: string;
    private alteredStemArray: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.alteredStem = this.stem.replace(/c$/, 'z');
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
