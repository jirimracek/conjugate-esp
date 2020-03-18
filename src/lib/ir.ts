/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { ModelInterface, RegionType, V2M_PronType, NONPRONOMINAL, V2M_AttrType, TERM, IR } from './interfaces';
import { Model } from './model';
import { esdrujula, dropAccents } from './tools';

export class Vivir extends Model implements ModelInterface {

    public constructor(alias: string, type: V2M_PronType, region: RegionType, attributes: V2M_AttrType) {
        super(alias, type, region, attributes);

        // Map the ar terminations to the basic object
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
            const entries = Object.entries(TERM[mode]);
            entries.push(...Object.entries(IR[mode]));
            // Need to make a new object copy otherwise we build the object from shallow copies and the termination constant gets modified  
            this.terms[mode] = JSON.parse(JSON.stringify(Object.fromEntries(entries)));
        });

        this.setTerminationTable();
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.terms.Indicativo['Presente'][1] = 'ís';
        }
    }

    protected setImperativoAfirmativo(): void {
        // All: 1,3,6 person: => '-'
        [0, 2, 5].forEach(index => this.table.Imperativo.Afirmativo[index] = '-');

        if (this.region === 'castellano') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = dropAccents(this.table.Indicativo.Presente[4].replace(/i?s$/, 'd'));
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
                this.table.Imperativo.Afirmativo[1] = dropAccents(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
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


