/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { IR } from './declarations/constants';

export class vivir extends BaseModel {

    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(IR));
        if (this.region === 'voseo') {
            this.desinences.Indicativo['Presente'][1] = 'ís';
        }
        this.localTermConfig();
        this.finishTermConfig();
    }

    protected localTermConfig(): void { }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' && this.type !== 'N') {
            // This is the only line that's different between AR ER IR.  So far. 3/18/20
            this.table.Imperativo.Afirmativo[4] = this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)i?s$/, '$1 $3$2');   // NOTE: ar == er != ir
        }
    }
}


export class abrir extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/rid/, 'iert')];
    }
}

export class adquirir extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)qui(.*)/;
        const replacement: string = '$1quie$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 4, 5], pattern, replacement);
        }
    }
}
export class argüir extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected setGerundio(): void {
        // change in stem from argü to argu. gerundio would get built as [argü] + 'iendo' 
        // first change the stem, then termination 
        //                         \u00fc ===  ü                      
        const pattern: RegExp = /(.)\u00fc(.*)/;
        const replacement: string = '$1u$2';
        this.table.Impersonal.Gerundio = [`${this.stem.replace(pattern, replacement)}${this.desinences.Impersonal.Gerundio[0].replace(/^i/, 'y')}`];
    }
    protected beforeImperatives(): void {
        const pattern: RegExp = /(.)\u00fci?(.*)/;
        const replacement: string = '$1uy$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0, 1, 2, 5], pattern, replacement);
            this.replaceIndicativoPreteritoIndefinito([2, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0, 2, 4, 5], pattern, replacement);
            this.replaceIndicativoPreteritoIndefinito([2, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceIndicativoPreteritoIndefinito([2, 4, 5], pattern, replacement);
        }
        if (this.region === 'formal') {
            this.replaceIndicativoPresente([0, 1, 2, 4, 5], pattern, replacement);
            this.replaceIndicativoPreteritoIndefinito([1, 2, 4, 5], pattern, replacement);
        }
        this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        this.replaceSubjuntivoPreteritoImperfectoRa([0, 1, 2, 3, 4, 5], pattern, replacement);
        this.replaceSubjuntivoPreteritoImperfectoSe([0, 1, 2, 3, 4, 5], pattern, replacement);
        this.replaceSubjuntivoFuturoImperfecto([0, 1, 2, 3, 4, 5], pattern, replacement);
    }
}