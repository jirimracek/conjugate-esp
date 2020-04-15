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
        this.configDesinences();
        this.configDesinencesByRegion();
    }

    protected configDesinences(): void { }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' && this.type === 'P') {
            // This is the only line that's different between AR ER IR.  So far. 3/18/20
            this.table.Imperativo.Afirmativo[4] =
                this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)i?s$/, '$1 $3$2');   // NOTE: ar == er != ir
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
export class surgir extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        const pattern: RegExp = /(.*)g(.*)/;
        const replacement: string = '$1j$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }
    }
}
export class servir extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives(): void {
        // Basically we need to replace e with i in different places.  In right places
        const replacement: string = '$1i';
        const eFollowedByE: RegExp = /(.*)e(?=.*[eé])/;
        const eFollowedByIe: RegExp = /(.*)e(?=.*i[eé])/;
        const lastE: RegExp = /(.*)e/;

        // Common places (covers complete voseo)
        this.table.Impersonal.Gerundio = [this.table.Impersonal.Gerundio[0].replace(/(.*)e(?=.*i)/, replacement)];

        this.replaceIndicativoPresente([0], /(.*)e(?=.*o)/, replacement);
        this.replaceIndicativoPresente([2, 5], eFollowedByE, replacement);

        this.replaceIndicativoPreteritoIndefinito([2], lastE, replacement);
        this.replaceIndicativoPreteritoIndefinito([5], eFollowedByE, replacement);

        this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], lastE, replacement);
        this.replaceSubjuntivoPreteritoImperfectoRa([0, 1, 2, 3, 4, 5], eFollowedByIe, replacement);
        this.replaceSubjuntivoPreteritoImperfectoSe([0, 1, 2, 3, 4, 5], eFollowedByIe, replacement);
        this.replaceSubjuntivoFuturoImperfecto([0, 1, 2, 3, 4, 5], eFollowedByIe, replacement);

        // Region diffs
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([1], eFollowedByE, replacement);
        } else {
            this.replaceIndicativoPresente([4], eFollowedByE, replacement);
            this.replaceIndicativoPreteritoIndefinito([4], eFollowedByE, replacement);
            if (this.region === 'canarias') {
                this.replaceIndicativoPresente([1], eFollowedByE, replacement);
            }
            if (this.region === 'formal') {
                this.replaceIndicativoPresente([1], eFollowedByE, replacement);
                this.replaceIndicativoPreteritoIndefinito([1], lastE, replacement);
            }
        }
    }
}
export class embaír extends vivir {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
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
        this.desinences.Subjuntivo.Preterito_Imperfecto_ra =
            this.desinences.Subjuntivo.Preterito_Imperfecto_ra.map((d, i) => i === 4 ? d.replace(/ie/, 'yé') : d.replace(/i/, 'y'));
        this.desinences.Subjuntivo.Preterito_Imperfecto_se =
            this.desinences.Subjuntivo.Preterito_Imperfecto_se.map((d, i) => i === 4 ? d.replace(/ie/, 'yé') : d.replace(/i/, 'y'));
        this.desinences.Subjuntivo.Futuro_Imperfecto =
            this.desinences.Subjuntivo.Futuro_Imperfecto.map((d, i) => i === 4 ? d.replace(/ie/, 'yé') : d.replace(/i/, 'y'));
    }
    protected setImperativoAfirmativo() {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano') {
            if (this.type === 'N') {
                this.table.Imperativo.Afirmativo[4] = this.table.Indicativo.Presente[4].replace(/s$/, 'd');
            } else {
            this.table.Imperativo.Afirmativo[4] =
                this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)ís$/, '$1 $3i$2');   // NOTE: ar == er != ir
            }
        }
    }
}
