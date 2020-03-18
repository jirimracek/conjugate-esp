/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { ModelInterface, RegionType, V2M_PronType, NONPRONOMINAL, V2M_AttrType, TERM, AR } from './interfaces';
import { Model } from './model';
import { esdrujula, dropAccents } from './tools';

/**
 * @class base class for all -ar conjugations
 */
export class Amar extends Model implements ModelInterface {

    public constructor(alias: string, type: V2M_PronType, region: RegionType, attributes: V2M_AttrType) {
        super(alias, type, region, attributes);

        // Initialize termination table
        // Map the ar terminations to the basic object
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
            const entries = Object.entries(TERM[mode]);
            entries.push(...Object.entries(AR[mode]));
            // Case: run voseo and follow by castellano, castellano will fail with ás on 2nd singular
            this.terms[mode] = JSON.parse(JSON.stringify(Object.fromEntries(entries)));
        });

        super.setTerminationTable();
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.terms.Indicativo['Presente'][1] = 'ás';
        }
    }

    protected setImperativoAfirmativo(): void {
        // All: 1,3,6 person: => '-'
        [0, 2, 5].forEach(index => this.table.Imperativo.Afirmativo[index] = '-');

        // Castellano
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: tú abandonas             => tú abandona   - drop 's'    
        //   P:                                   tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:   nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                   nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural indicativo presente:   vosotros abandonáis      => vosotros abandonad  - drop 'is', drop accent, attach 'd'
        //   P:                                   vosotros os abandonáis   => vosotros abandonaos - drop 'is', drop accent, switch pronombre os
        if (this.region === 'castellano') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                // this.table.Imperativo.Afirmativo[4] = dropAccents(this.table.Indicativo.Presente[4].replace(/is$/, 'd'));
                this.table.Imperativo.Afirmativo[4] = dropAccents(this.table.Indicativo.Presente[4].replace(/i?s$/, 'd'));
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                // This is the only line that's different between AR ER IR.  So far. 3/18/20
                this.table.Imperativo.Afirmativo[4] = dropAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));    // NOTE: ar == er != ir
            }
        }

        // Voseo
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: vos abandonás             => vos abandona   - drop 's'
        //   P:                                   vos te abandonás          => vos abandonate - drop 's', switch pronombre te, drop accent
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:   nosotros abandonemos      => nosotros abandonemos   - no change
        //   P:                                   nosotros nos abandonemos  => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural subjuntivo presente:   ustedes abandonen         => ustedes abandonen   - no change
        //   P:                                   ustedes se abandonen      => ustedes abandónense - switch pronombre se, esdrujula
        if (this.region === 'voseo') {
            if (this.type === NONPRONOMINAL) {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = dropAccents(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                this.table.Imperativo.Afirmativo[4] = esdrujula(this.table.Subjuntivo.Presente[4].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2'));
            }
        }

        // Formal
        // 2nd singular, idx 1:
        //   N: 2nd singular subjuntivo presente:  usted abandone             => usted abandone - no change    
        //   P:                                    usted se abandone          => usted abandónese - switch pronombre se, esdrujula
        // 1st plural, idx 3: 
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4: 
        //   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
        //   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
        if (this.region === 'formal') {
            if (this.type === NONPRONOMINAL) {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = this.table.Subjuntivo.Presente[index]);
            } else {
                [1, 4].forEach(index => this.table.Imperativo.Afirmativo[index] = esdrujula(this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*) (.*)$/, '$1 $3$2')));
            }
        }
        // Canarias
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente:  tú abandonas             => tú abandona   - drop 's'    
        //   P:                                    tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
        // 1st plural, idx 3:
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        // 2nd plural, idx 4:
        //   N: 2nd plural subjuntivo presente:    ustedes abandonen        => ustedes abandonen   - no change
        //   P:                                    ustedes se abandonen     => ustedes abandónense - switch pronombre se, esdrujula
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
        //   N: 1st plural subjuntivo presente:    nosotros abandonemos     => nosotros abandonemos   - no change
        //   P:                                    nosotros nos abandonemos => nosotros abandonémonos - drop 's' switch pronombre nos, esdrujula
        if (this.type === NONPRONOMINAL) {
            this.table.Imperativo.Afirmativo[3] = this.table.Subjuntivo.Presente[3];
        } else {
            this.table.Imperativo.Afirmativo[3] = esdrujula(this.table.Subjuntivo.Presente[3].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
        }
    }
}


