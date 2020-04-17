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
        this.configDesinences();
        this.setDesinencesByRegion();
    }

    protected configDesinences(): void {
        if (this.region === 'voseo') {
            this.desinences.Indicativo['Presente'][1] = 'ís';
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
    protected setSubjuntivoPresentePattern_0125(replacement: string): void {
        switch (this.region) {
            case 'castellano':
                super.setSubjuntivoPresente([replacement, replacement, replacement, this.stem, this.stem, replacement]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setSubjuntivoPresente([replacement, replacement, replacement, this.stem, replacement, replacement]);
                break;
        }
    }
}


export class abrir extends vivir {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/rid/, 'iert')];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }
}

// Just like pensar
export class adquirir extends vivir {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/ir/, 'ier');
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class argüir extends vivir {
    private replacement: string;
    private replacements: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        //                                \u00fc ===  ü                      
        this.replacement = this.stem.replace(/\u00fc/, 'u');
        this.replacements = Array(6).fill(0,0).map(() => this.replacement);
    }

    protected configDesinences() {
        super.configDesinences();
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        [0, 2, 5].forEach(i => this.desinences.Indicativo.Presente[i] = `y${this.desinences.Indicativo.Presente[i]}`);
        if (this.region !== 'voseo') {
            this.desinences.Indicativo.Presente[1] = `y${this.desinences.Indicativo.Presente[1]}`;
        }
        const pattern = /^i/;
        const replacement = 'y';
        [2, 5].forEach(i => this.desinences.Indicativo.Preterito_Indefinido[i] =
            this.desinences.Indicativo.Preterito_Indefinido[i].replace(pattern, replacement));

        [0, 1, 2, 3, 4, 5].forEach(i => {
            this.desinences.Subjuntivo.Presente[i] = `y${this.desinences.Subjuntivo.Presente[i]}`;
            this.desinences.Subjuntivo.Preterito_Imperfecto_ra[i] =
                this.desinences.Subjuntivo.Preterito_Imperfecto_ra[i].replace(pattern, replacement);
            this.desinences.Subjuntivo.Preterito_Imperfecto_se[i] =
                this.desinences.Subjuntivo.Preterito_Imperfecto_se[i].replace(pattern, replacement);
            this.desinences.Subjuntivo.Futuro_Imperfecto[i] =
                this.desinences.Subjuntivo.Futuro_Imperfecto[i].replace(pattern, replacement);
        });
    }

    protected setGerundio(): void {
        // change in stem from argü to argu. gerundio would get built as [argü] + 'iendo' 
        super.setGerundio(this.replacement);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPreteritoIndefinido([this.stem, this.stem, this.replacement, this.stem, this.stem, this.replacement]);
                break;
            case 'voseo':
            case 'canarias':
                super.setIndicativoPreteritoIndefinido([this.stem, this.stem, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
            case 'formal':
                super.setIndicativoPreteritoIndefinido([this.stem, this.replacement, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
        }
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        super.setSubjuntivoPreteritoImperfectoRa(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        super.setSubjuntivoPreteritoImperfectoSe(this.replacements);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        super.setSubjuntivoFuturoImperfecto(this.replacements);
    }
}

// Really special - combination of vivir & amar
export class balbucir extends vivir {
        private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/c$/, 'ce');
    }
    protected configDesinences() {
        super.configDesinences();

        // Adopt desinences from AR
        this.desinences.Subjuntivo.Presente = JSON.parse(JSON.stringify(AR.Subjuntivo.Presente));
    }
    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem ]);
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array(6).fill(0,0).map(() => this.replacement));
    }
}

export class discernir extends vivir {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)e/, '$1ie');
        // this.replacement = this.stem;
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }

    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class lucir extends vivir {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)c/, '$1zc');
        // this.replacement = this.stem;
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }

    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array(6).fill(0,0).map(() => this.replacement));
    }
}

export class embaír extends vivir {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences() {
        super.configDesinences();
        this.desinences.Impersonal.Infinitivo = ['ír', 'írse'];
        this.desinences.Impersonal.Gerundio = ['yendo', 'yéndose'];
        this.desinences.Impersonal.Participio = ['ído'];
        this.desinences.Indicativo.Presente[0] = 'yo';
        this.desinences.Indicativo.Presente[3] = 'ímos';
        this.desinences.Indicativo.Preterito_Indefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];
        this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(t => `y${t}`);

        let pattern = /i/;
        let replacement = 'y';
        [0, 1, 2, 3, 5].forEach(i => {
            this.desinences.Subjuntivo.Preterito_Imperfecto_ra[i] =
                this.desinences.Subjuntivo.Preterito_Imperfecto_ra[i].replace(pattern, replacement);
            this.desinences.Subjuntivo.Preterito_Imperfecto_se[i] =
                this.desinences.Subjuntivo.Preterito_Imperfecto_se[i].replace(pattern, replacement);
            this.desinences.Subjuntivo.Futuro_Imperfecto[i] =
                this.desinences.Subjuntivo.Futuro_Imperfecto[i].replace(pattern, replacement);
        });
        pattern = /ie/;
        replacement = 'yé';
        this.desinences.Subjuntivo.Preterito_Imperfecto_ra[4] =
            this.desinences.Subjuntivo.Preterito_Imperfecto_ra[4].replace(pattern, replacement);
        this.desinences.Subjuntivo.Preterito_Imperfecto_se[4] =
            this.desinences.Subjuntivo.Preterito_Imperfecto_se[4].replace(pattern, replacement);
        this.desinences.Subjuntivo.Futuro_Imperfecto[4] =
            this.desinences.Subjuntivo.Futuro_Imperfecto[4].replace(pattern, replacement);
    }
}

export class surgir extends vivir {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/g$/, 'j');
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array(6).fill(0,0).map(() => this.replacement));
    }
}

export class servir extends vivir {
    private replacement: string;
    private replacements: string[];

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)e/, '$1i');
        this.replacements = Array(6).fill(0,0).map(() => this.replacement);
    }

    protected setGerundio(): void {
        // This is the only replacement root form so just set it here for the rest of them
        super.setGerundio(this.replacement);
    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPreteritoIndefinido([this.stem, this.stem, this.replacement, this.stem, this.stem, this.replacement]);
                break;
            case 'voseo':
            case 'canarias':
                super.setIndicativoPreteritoIndefinido([this.stem, this.stem, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
            case 'formal':
                super.setIndicativoPreteritoIndefinido([this.stem, this.replacement, this.replacement, this.stem, this.replacement, this.replacement]);
                break;
        }
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        super.setSubjuntivoPreteritoImperfectoRa(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        super.setSubjuntivoPreteritoImperfectoSe(this.replacements);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        super.setSubjuntivoFuturoImperfecto(this.replacements);
    }
}

