/**
 * @copyright 
 * Copyright (c) 2020-2021 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020-2021 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/

/* Do not export anything but classes from these model files, model factory depends on these exports */

import {BaseModel, ModelAttributes, DesinenceTable} from './basemodel';
import {clearLastAccent} from './stringutils';
import {Regions} from './types';

// Temp arrays used to remap
const Array_6 = Array(6).fill('');

// Common to Andar and Estar
const caeIndicativoPreteritoIndefinido = (region: Regions): Array<string> => {
    return ['uve',
        region !== 'formal' ? 'uviste' : 'uvo',
        'uvo',
        'uvimos',
        region !== 'castellano' ? 'uvieron' : 'uvisteis',
        'uvieron'];
};

const caeSubjuntivoPreteritoImperfectoRa = (region: Regions): Array<string> => {
    return ['uviera',
        region !== 'formal' ? 'uvieras' : 'uviera',
        'uviera',
        'uviéramos',
        region !== 'castellano' ? 'uvieran' : 'uvierais',
        'uvieran'];
};

const caeSubjuntivoPreteritoImperfectoSe =
    (region: Regions): Array<string> => {
        return caeSubjuntivoPreteritoImperfectoRa(region).map(d => d.replace('ra', 'se'));
    };

const caeSubjuntivoFuturoImperfecto =
    (region: Regions): Array<string> => {
        return caeSubjuntivoPreteritoImperfectoRa(region).map(d => d.replace('ra', 're'));
    };

/* eslint-disable @typescript-eslint/naming-convention */
/**
     * @class base class for all -ar conjugations
     */
export class hablar extends BaseModel {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences = this.initDesinences(region);
    }

    // Initialize termination table, map ar terminations to the base
    private initDesinences(region: Regions): DesinenceTable {
        return {
            Impersonal: {
                Infinitivo: !this.reflexive ? 'ar' : 'arse',
                Gerundio: !this.reflexive ? 'ando' : 'ándose',
                Participio: 'ado'
            },
            Indicativo: {
                Presente: ['o',
                    region !== 'voseo' ? (region !== 'formal' ? 'as' : 'a') : 'ás',
                    'a',
                    'amos',
                    region !== 'castellano' ? 'an' : 'áis',
                    'an'
                ],
                PreteritoImperfecto: ['aba',
                    region !== 'formal' ? 'abas' : 'aba',
                    'aba',
                    'ábamos',
                    region !== 'castellano' ? 'aban' : 'abais',
                    'aban'
                ],
                PreteritoIndefinido: ['é',
                    region !== 'formal' ? 'aste' : 'ó',
                    'ó',
                    'amos',
                    region !== 'castellano' ? 'aron' : 'asteis',
                    'aron'
                ],
                FuturoImperfecto: ['aré',
                    region !== 'formal' ? 'arás' : 'ará',
                    'ará',
                    'aremos',
                    region !== 'castellano' ? 'arán' : 'aréis',
                    'arán'
                ],
                CondicionalSimple: ['aría',
                    region !== 'formal' ? 'arías' : 'aría',
                    'aría',
                    'aríamos',
                    region !== 'castellano' ? 'arían' : 'aríais',
                    'arían']
            },
            Subjuntivo: {
                Presente: ['e',
                    region !== 'formal' ? 'es' : 'e',
                    'e',
                    'emos',
                    region !== 'castellano' ? 'en' : 'éis',
                    'en'
                ],
                PreteritoImperfectoRa: ['ara',
                    region !== 'formal' ? 'aras' : 'ara',
                    'ara',
                    'áramos',
                    region !== 'castellano' ? 'aran' : 'arais',
                    'aran'
                ],
                PreteritoImperfectoSe: ['ase',
                    region !== 'formal' ? 'ases' : 'ase',
                    'ase',
                    'ásemos',
                    region !== 'castellano' ? 'asen' : 'aseis',
                    'asen'
                ],
                FuturoImperfecto: ['are',
                    region !== 'formal' ? 'ares' : 'are',
                    'are',
                    'áremos',
                    region !== 'castellano' ? 'aren' : 'areis',
                    'aren'
                ]
            }
        };
    }
}


export class acertar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
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

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class actuar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)u/, '$1ú');
        // 2010 orthography
        if (typeof this.attributes['M'] !== 'undefined' && this.attributes['M'] === 'true') {
            if (region === 'voseo') {
                this.desinences.Indicativo.Presente[1] = 'as';
            }
            if (region === 'castellano') {
                this.desinences.Indicativo.Presente[4] = 'ais';
                this.desinences.Subjuntivo.Presente[4] = 'eis';
            }
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
            }
            this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
            this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class engorar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/or$/, 'üer');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class aguar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/u$/, 'ü');
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => this.alteredStem));
    }
}

export class ahincar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

export class aislar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/i/, 'í');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class andar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Indicativo.PreteritoIndefinido = caeIndicativoPreteritoIndefinido(region);
        this.desinences.Subjuntivo.PreteritoImperfectoRa = caeSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = caeSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = caeSubjuntivoFuturoImperfecto(region);
    }
}

export class aunar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/u/, 'ú');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class avergonzar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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
export class cabrahigar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/i/, 'í');
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            `u${this.desinences.Indicativo.PreteritoIndefinido[0]}`;
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `u${d}`);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class colgar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'ue');
        this.desinences.Indicativo.PreteritoIndefinido[0] =
            `u${this.desinences.Indicativo.PreteritoIndefinido[0]}`;
        this.desinences.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map(d => `u${d}`);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class contar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

export class dar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);

        this.desinences.Indicativo.Presente = ['oy',
            region !== 'formal' ? 'as' : 'a',
            'a',
            'amos',
            region !== 'castellano' ? 'an' : 'ais',
            'an'
        ];

        this.desinences.Indicativo.PreteritoIndefinido = ['i',
            region !== 'formal' ? 'iste' : 'io',
            'io',
            'imos',
            region !== 'castellano' ? 'ieron' : 'isteis',
            'ieron'
        ];

        this.desinences.Subjuntivo.Presente = ['é',
            region !== 'formal' ? 'es' : 'é',
            'é',
            'emos',
            region !== 'castellano' ? 'en' : 'eis',
            'en'
        ];

        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['iera',
            region !== 'formal' ? 'ieras' : 'iera',
            'iera',
            'iéramos',
            region !== 'castellano' ? 'ieran' : 'ierais',
            'ieran'
        ];
        this.desinences.Subjuntivo.PreteritoImperfectoSe =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/ra/, 'se'));
        this.desinences.Subjuntivo.FuturoImperfecto =
            this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/ra/, 're'));
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.reflexive && this.region === 'formal') {
            this.table.Imperativo.Afirmativo[1] = clearLastAccent(this.table.Imperativo.Afirmativo[1]);
        }
    }
}

export class desdar extends dar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Indicativo.Presente = ['oy',
            region !== 'formal' ? 'ás' : 'á',
            'á',
            'amos',
            region !== 'castellano' ? 'án' : 'áis',
            'án'
        ];

        this.desinences.Indicativo.PreteritoIndefinido = ['í',
            region !== 'formal' ? 'iste' : 'ió',
            'ió',
            'imos',
            region !== 'castellano' ? 'ieron' : 'isteis',
            'ieron'
        ];

        this.desinences.Subjuntivo.Presente = ['é',
            region !== 'formal' ? 'és' : 'é',
            'é',
            'emos',
            region !== 'castellano' ? 'én' : 'éis',
            'én'
        ];
    }
}

export class desosar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/o/, 'hue');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class enraizar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
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

export class errar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = `y${this.stem}`;
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class estar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Indicativo.Presente = [
            'oy',
            region !== 'formal' ? 'ás' : 'á',
            'á',
            'amos',
            region !== 'castellano' ? 'án' : 'áis',
            'án'
        ];
        this.desinences.Subjuntivo.Presente = [
            'é',
            region !== 'formal' ? 'és' : 'é',
            'é',
            'emos',
            region !== 'castellano' ? 'én' : 'éis',
            'én'];

        this.desinences.Indicativo.PreteritoIndefinido = caeIndicativoPreteritoIndefinido(region);
        this.desinences.Subjuntivo.PreteritoImperfectoRa = caeSubjuntivoPreteritoImperfectoRa(region);
        this.desinences.Subjuntivo.PreteritoImperfectoSe = caeSubjuntivoPreteritoImperfectoSe(region);
        this.desinences.Subjuntivo.FuturoImperfecto = caeSubjuntivoFuturoImperfecto(region);
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.reflexive) {
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

export class forzar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
    }

    protected setIndicativoPresente(): void {
        const local = this.stem.replace(/o/, 'ue');
        this.setIndicativoPresentePattern125(local, local);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/orz/, 'uerc'), this.stem.replace(/z/, 'c'));
    }
}

export class jugar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
    }

    protected setIndicativoPresente(): void {
        const local = this.stem.replace(/g/, 'eg');
        this.setIndicativoPresentePattern125(local, local);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/g$/, 'gu'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/g$/, 'egu'), this.stem.replace(/g$/, 'gu'));
    }
}

export class pagar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => `u${d}`);
    }
}

export class regar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)e/, '$1ie');
        this.desinences.Indicativo.PreteritoIndefinido[0] = 'ué';
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => `u${d}`);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class rozar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/z$/, 'c');
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => this.alteredStem));
    }
}

export class sacar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/c$/, 'qu'));
    }

    protected setSubjuntivoPresente(): void {
        const alteredStem = this.stem.replace(/(.*)c/, '$1qu');
        this.setTable('Subjuntivo', 'Presente',
            Array_6.map(() => alteredStem));
    }
}

export class tropezar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/e(.?)z$/, 'ie$1z');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        this.setIndicativoPreteritoIndefinidoPattern0(this.stem.replace(/z$/, 'c'));
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.stem.replace(/e(.?)z$/, 'ie$1c'),
            this.stem.replace(/z$/, 'c'));
    }
}

export class vaciar extends hablar {
    private alteredStem: string;

    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
        this.alteredStem = this.stem.replace(/(.*)i/, '$1í');
        // 2010 orthography
        if (typeof this.attributes['M'] !== 'undefined' && this.attributes['M'] === 'true') {
            if (region === 'voseo') {
                this.desinences.Indicativo.Presente[1] = 'as';
            }
            if (region === 'castellano') {
                this.desinences.Indicativo.Presente[4] = 'ais';
                this.desinences.Subjuntivo.Presente[4] = 'eis';
            }
            if (region === 'formal') {
                this.desinences.Indicativo.PreteritoIndefinido[1] = 'o';
            }
            this.desinences.Indicativo.PreteritoIndefinido[0] = 'e';
            this.desinences.Indicativo.PreteritoIndefinido[2] = 'o';
        }
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.alteredStem, this.alteredStem);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern0125(this.alteredStem);
    }
}

export class volcar extends hablar {
    public constructor(verb: string, region: Regions, attributes: ModelAttributes) {
        super(verb, region, attributes);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern125(this.stem.replace(/(.*)o/, '$1ue'),
            this.stem.replace(/(.*)o/, '$1ue'));
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