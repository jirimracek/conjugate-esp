/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { esdrujula, clearAccents } from './utilities/stringutils';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { TERM, IR, NONPRONOMINAL, PRONOMINAL } from './declarations/constants';

export class vivir extends BaseModel  {

    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);

        // Map the ar terminations to the basic object
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
            const entries = Object.entries(TERM[mode]);
            entries.push(...Object.entries(IR[mode]));
            // Need to make a new object copy otherwise we build the object from shallow copies and the termination constant gets modified  
            this.terms[mode] = JSON.parse(JSON.stringify(Object.fromEntries(entries)));
        });

        this.configTerminations();
    }

    protected configTerminations(): void {
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.terms.Indicativo['Presente'][1] = 'ís';
        }
        super.configTerminations();
    }

    protected setImperativoAfirmativo(): void {

        if (this.region === 'castellano') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/i?s$/, 'd'));
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                // This is the only line that's different between AR ER IR.  So far. 3/18/20
                this.table.Imperativo.Afirmativo[4] = this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)i?s$/, '$1 $3$2');   // NOTE: ar == er != ir
            }
        }

        if (this.region === 'voseo') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = clearAccents(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                this.table.Imperativo.Afirmativo[4] = esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2'));
            }
        }

        if (this.region === 'formal') {
            if (this.type === NONPRONOMINAL) {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = this.table.Subjuntivo.Presente[index]);
            } else {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = esdrujula(this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2')));
            }
        }
        if (this.region === 'canarias') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                this.table.Imperativo.Afirmativo[4] = esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2'));
            }
        }

        // 1st plural, idx 3 - same for all regions
        if (this.type === NONPRONOMINAL) {
            this.table.Imperativo.Afirmativo[3] = this.table.Subjuntivo.Presente[3];
        } else {
            this.table.Imperativo.Afirmativo[3] = esdrujula(this.table.Subjuntivo.Presente[3].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
        }
    }
}


export class abrir extends vivir  {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.terms.Impersonal.Participio}`.replace(/rid/, 'iert')];
    }
}

export class adquirir extends vivir  {
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
export class argüir extends vivir  {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected setGerundio(): void {
        // note there is a change in stem from argü to argu. gerundio would get built as [argü] + 'iendo' 
        // first change the stem, then termination 
        //                         \u00fc ===  ü                      
        const pattern: RegExp = /(.)\u00fc(.*)/;
        const replacement: string = '$1u$2';
        this.table.Impersonal.Gerundio = [`${this.stem.replace(pattern, replacement)}${ this.terms.Impersonal.Gerundio[0].replace(/^i/, 'y') }`];
        // this.table.Impersonal.Gerundio = [`${this.stem.replace(pattern, replacement)}${(this.type === PRONOMINAL ?
        //     this.terms.Impersonal.Gerundio[1].replace(/^i/, 'y') : 
        //     this.terms.Impersonal.Gerundio[0].replace(/^i/, 'y'))}`];
    }
    protected beforeImperatives() :void {
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