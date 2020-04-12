/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { PronominalKeys, Regions, ConjugationTable, ModelAttributes, DefectiveType, PronounsTable } from './declarations/types';
import { PRONOUNS, AUX_HABER } from './declarations/constants';
import { clearAccents, esdrujula } from './utilities/stringutils';

export abstract class BaseModel {
    protected type: PronominalKeys;
    protected region: Regions;
    protected pronouns: PronounsTable = PRONOUNS;

    protected desinences: ConjugationTable = {};
    protected auxHaber: ConjugationTable = {};
    protected table: ConjugationTable = {};
    protected participioCompuesto = '';
    protected stem: string = '';

    protected attributes: ModelAttributes;

    protected constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        this.type = type;
        this.region = region;
        this.attributes = attributes;
        this.auxHaber = JSON.parse(JSON.stringify(AUX_HABER));

        // Defective attributes:
        // {d:imorfo|eimorfo|imper|tercio|terciop|mmorfo|bimorfop|bimorfog|trimorfo|omorfo|omorfos}
        const defectiveType = attributes['_d_'] as DefectiveType;
        if (defectiveType) {
            // Normally we use the PRONOMBRES table unless the defective form dictates that the pronouns
            // are not to be used. Defectives imper, tercio and terciop
            if (['imper', 'tercio', 'terciop'].includes(defectiveType)) {
                // Dup the pronouns object so we don't disturb the constant
                this.pronouns = JSON.parse(JSON.stringify(this.pronouns));
                // fill pronouns arrays with blanks as they're not used
                (['N', 'P'] as PronominalKeys[]).forEach(pronominalkey => {
                    (['castellano', 'voseo', 'formal', 'canarias'] as Regions[]).forEach(region => {
                        this.pronouns[pronominalkey][region] = Array.from('      ');
                    });
                });
            }
        }

        // initialize result conjugation table
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => this.table[mode] = {});
        this.table.Imperativo.Afirmativo = Array.from('------');
        this.table.Imperativo.Negativo = Array.from('------');
    }

    /**
     * Reorder terminations based on the region.  Call in derived class once we have the terminations configured
     * based on verb type, defectives, etc.  This is the last step, common to everyone.
     */
    protected finishTermConfig() {
        // Shuffle terminations and auxHaber based on region
        if (this.region === 'voseo') {                      // Voseo, 2nd singular -> accented version, 2nd plural -> ustedes 
            // desinences
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple'].forEach(mode =>
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]);
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto'].forEach(mode =>
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]);

            // auxHaber
            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto'].forEach(mode =>
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]);
            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto'].forEach(mode =>
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]);

        } else if (this.region === 'formal') {               // Castellano formal, 2nd singular -> usted, 2nd plural -> ustedes
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple'].forEach(mode => {
                this.desinences.Indicativo[mode][1] = this.desinences.Indicativo[mode][2];
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]
            });
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto'].forEach(mode => {
                this.desinences.Subjuntivo[mode][1] = this.desinences.Subjuntivo[mode][2];
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]
            });

            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto'].forEach(mode => {
                this.auxHaber.Indicativo[mode][1] = this.auxHaber.Indicativo[mode][2];
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]
            });
            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto'].forEach(mode => {
                this.auxHaber.Subjuntivo[mode][1] = this.auxHaber.Subjuntivo[mode][2];
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]
            });

        } else if (this.region === 'canarias') {             // Canarias, 2nd singular remains the same, 2nd plural -> ustedes
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple'].forEach(mode =>
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]);
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto'].forEach(mode =>
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]);

            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto'].forEach(mode =>
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]);
            ['Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto'].forEach(mode =>
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]);
        }

        // Apply defective rules, if any, to desinences.  Basically we replace the invalid desinence with a '-'
        // When all is done at then end, all forms that end with an '-' get replaced with '-' 
        // {d:imorfo|eimorfo|imper|tercio|terciop|mmorfo|bimorfop|bimorfog|trimorfo|omorfo|omorfos}
        const defectiveType = this.attributes['_d_'] as DefectiveType;
        if (defectiveType && defectiveType === 'imorfo') {
            // imorfo - formas cuya desinencia empieza por la vocal 'i' 
            // all singles that don't start with i get replaced with '-'
            // This really only applies to ir verbs
            ['Indicativo', 'Subjuntivo'].forEach(mode => {
                this.desinences[mode]['Presente'] = this.desinences[mode]['Presente'].map(d => /^[ií]/.test(d) ? d : '-');
            });
        }
        // impersonal - infinitivo, gerundio, participio y en las terceras personas del singular 
        if (defectiveType && defectiveType === 'imper') {
            ['Indicativo', 'Subjuntivo'].forEach(mode => {
                Object.keys(this.desinences[mode]).forEach(time => {
                    [0, 1, 3, 4, 5].forEach(index => this.desinences[mode][time][index] = '-');
                });
                Object.keys(this.auxHaber[mode]).forEach(time => {
                    [0, 1, 3, 4, 5].forEach(index => this.auxHaber[mode][time][index] = '-');
                });
            });
        }
    }

    public getConjugationOf(verb: string): ConjugationTable {
        this.stem = verb.replace(/..$/, '');

        this.setInfinitivo();
        this.setGerundio();
        this.setParticipio();
        this.setParticipioCompuesto();
        this.afterImpersonales();

        this.setIndicativoPresente();
        this.setIndicativoPreteritoImperfecto();
        this.setIndicativoPreteritoIndefinido();
        this.setIndicativoFuturoImperfecto();
        this.setIndicativoCondicionalSimple();

        this.setIndicativoPreteritoPerfecto();
        this.setIndicativoPreteritoPluscuamperfecto();
        this.setIndicativoPreteritoAnterior();
        this.setIndicativoFuturoPerfecto();
        this.setIndicativoCondicionalCompuesto();

        this.setSubjuntivoPresente();
        this.setSubjuntivoPreteritoImperfectoRa();
        this.setSubjuntivoPreteritoImperfectoSe();
        this.setSubjuntivoFuturoImperfecto();

        this.setSubjuntivoPreteritoPerfecto();
        this.setSubjuntivoPreteritoPluscuamperfectoRa();
        this.setSubjuntivoPreteritoPluscuamperfectoSe();
        this.setSubjuntivoFuturoPerfecto();

        this.beforeImperatives();

        this.setImperativoAfirmativo();
        this.setImperativoNegativo();

        this.applyDefectives();

        return this.table;
    }

    // Allow participio, gerundio modifications after the base versions are set
    protected afterImpersonales(): void { }

    // Allow irregular modifications in derived classes before calling imperatives
    // imperatives get built from indicative/subjuntive modes
    protected beforeImperatives(): void { }

    private applyDefectives(): void {
        // {d:imorfo|eimorfo|imper|tercio|terciop|mmorfo|bimorfop|bimorfog|trimorfo|omorfo|omorfos}
        const defectiveType = this.attributes['_d_'] as DefectiveType;
        // trimorfo infinitivo y en las segundas personas del imperativo
        if (defectiveType && defectiveType === 'trimorfo') {
            this.table.Impersonal.Gerundio = ['-'];
            this.table.Impersonal.Participio = ['-'];
            ['Indicativo', 'Subjuntivo' ].forEach(mode => {
                Object.keys(this.table[mode]).forEach(time => {
                    [0, 1, 2, 3, 4, 5].forEach(index => this.table[mode][time][index] = '-');
                });
            });
            ['Imperativo'].forEach(mode => {
                Object.keys(this.table[mode]).forEach(time => {
                    [2, 3].forEach(index => this.table[mode][time][index] = '-');
                });
            });
        }
        // terciopersonal, v2 - infinitivo, gerundio, participio y en terceras personas
        if (defectiveType && defectiveType === 'terciop') {
            ['Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
                Object.keys(this.table[mode]).forEach(time => {
                    [0, 1, 3, 4].forEach(index => this.table[mode][time][index] = '-');
                });
            });
        }

    }

    protected setInfinitivo(): void {
        this.table.Impersonal.Infinitivo = [`${this.stem}${(this.type === 'P' ? this.desinences.Impersonal.Infinitivo[1] : this.desinences.Impersonal.Infinitivo[0])}`];
    }
    protected setGerundio(): void {
        this.table.Impersonal.Gerundio = [`${this.stem}${(this.type === 'P' ? this.desinences.Impersonal.Gerundio[1] : this.desinences.Impersonal.Gerundio[0])}`];
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`];
    }
    protected setParticipioCompuesto(): void {
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }

    /////////////////////////////////////////////////////////////////
    // Indicativo simple
    private formSimple(desinence: string, index: number): string {
        if (desinence !== '-') {
            return `${this.pronouns[this.type][this.region][index]} ${this.stem}${desinence}`.trim();
        }
        return '-';
    }

    // Set simple methods
    protected setIndicativoPresente(): void {
        this.table.Indicativo.Presente = this.desinences.Indicativo.Presente.map((desinence, index) => this.formSimple(desinence, index));
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.table.Indicativo.Preterito_Imperfecto = this.desinences.Indicativo.Preterito_Imperfecto.map((desinence, index) => this.formSimple(desinence, index));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.table.Indicativo.Preterito_Indefinido = this.desinences.Indicativo.Preterito_Indefinido.map((desinence, index) => this.formSimple(desinence, index));
    }

    protected setIndicativoFuturoImperfecto(): void {
        this.table.Indicativo.Futuro_Imperfecto = this.desinences.Indicativo.Futuro_Imperfecto.map((desinence, index) => this.formSimple(desinence, index));
    }
    protected setIndicativoCondicionalSimple(): void {
        this.table.Indicativo.Condicional_Simple = this.desinences.Indicativo.Condicional_Simple.map((desinence, index) => this.formSimple(desinence, index));
    }

    // Replace simple methods
    protected replaceIndicativoPresente(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Indicativo.Presente[index] = this.table.Indicativo.Presente[index].replace(pattern, replacement));
    }
    protected replaceIndicativoPreteritoIndefinito(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = this.table.Indicativo.Preterito_Indefinido[index].replace(pattern, replacement));
    }

    /////////////////////////////////////////////////////////////////
    // Compuesto
    private formCompuesto(aux: string, index: number): string {
        if (aux !== '-') {
            return `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim();
        }
        return '-';
    }

    protected setIndicativoPreteritoPerfecto(): void {
        this.table.Indicativo.Preterito_Perfecto = this.auxHaber.Indicativo.Preterito_Perfecto.map((aux, index) => this.formCompuesto(aux, index));
    }
    protected setIndicativoPreteritoPluscuamperfecto(): void {
        this.table.Indicativo.Preterito_Pluscuamperfecto = this.auxHaber.Indicativo.Preterito_Pluscuamperfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoPreteritoAnterior(): void {
        this.table.Indicativo.Preterito_Anterior = this.auxHaber.Indicativo.Preterito_Anterior.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoFuturoPerfecto(): void {
        this.table.Indicativo.Futuro_Perfecto = this.auxHaber.Indicativo.Futuro_Perfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoCondicionalCompuesto(): void {
        this.table.Indicativo.Condicional_Compuesto = this.auxHaber.Indicativo.Condicional_Compuesto.map((t, index) => this.formCompuesto(t, index));
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo simple set methods
    protected setSubjuntivoPresente(): void {
        this.table.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map((desinence, index) => this.formSimple(desinence, index));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.table.Subjuntivo.Preterito_Imperfecto_ra = this.desinences.Subjuntivo.Preterito_Imperfecto_ra.map((desinence, index) => this.formSimple(desinence, index));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.table.Subjuntivo.Preterito_Imperfecto_se = this.desinences.Subjuntivo.Preterito_Imperfecto_se.map((desinence, index) => this.formSimple(desinence, index));
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.table.Subjuntivo.Futuro_Imperfecto = this.desinences.Subjuntivo.Futuro_Imperfecto.map((desinence, index) => this.formSimple(desinence, index));
    }

    // Sub simple replace methods
    protected replaceSubjuntivoPresente(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Presente[index] = this.table.Subjuntivo.Presente[index].replace(pattern, replacement));
    }

    protected replaceSubjuntivoPreteritoImperfectoRa(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Preterito_Imperfecto_ra[index] = this.table.Subjuntivo.Preterito_Imperfecto_ra[index].replace(pattern, replacement));
    }

    protected replaceSubjuntivoPreteritoImperfectoSe(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Preterito_Imperfecto_se[index] = this.table.Subjuntivo.Preterito_Imperfecto_se[index].replace(pattern, replacement));
    }

    protected replaceSubjuntivoFuturoImperfecto(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Futuro_Imperfecto[index] = this.table.Subjuntivo.Futuro_Imperfecto[index].replace(pattern, replacement));
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo compuesto
    protected setSubjuntivoPreteritoPerfecto(): void {
        this.table.Subjuntivo.Preterito_Perfecto = this.auxHaber.Subjuntivo.Preterito_Perfecto.map((aux, index) => this.formCompuesto(aux, index));
    }
    protected setSubjuntivoPreteritoPluscuamperfectoRa(): void {
        this.table.Subjuntivo.Preterito_Pluscuamperfecto_ra = this.auxHaber.Subjuntivo.Preterito_Pluscuamperfecto_ra.map((aux, index) => this.formCompuesto(aux, index));
    }
    protected setSubjuntivoPreteritoPluscuamperfectoSe(): void {
        this.table.Subjuntivo.Preterito_Pluscuamperfecto_se = this.auxHaber.Subjuntivo.Preterito_Pluscuamperfecto_se.map((aux, index) => this.formCompuesto(aux, index));
    }
    protected setSubjuntivoFuturoPerfecto(): void {
        this.table.Subjuntivo.Futuro_Perfecto = this.auxHaber.Subjuntivo.Futuro_Perfecto.map((aux, index) => this.formCompuesto(aux, index));
    }

    // Imperatives
    protected setImperativoAfirmativo(): void {
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
            if (this.type === 'N') {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/i?s$/, 'd'));
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
                // This is the only line that's different between AR ER IR.  So far. 3/18/20
                // this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));    // NOTE: ar == er != ir
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
            if (this.type === 'N') {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = this.table.Subjuntivo.Presente[4];
            } else {
                this.table.Imperativo.Afirmativo[1] = clearAccents(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
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
            if (this.type === 'N') {
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
            if (this.type === 'N') {
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
        if (this.type === 'N') {
            this.table.Imperativo.Afirmativo[3] = this.table.Subjuntivo.Presente[3];
        } else {
            this.table.Imperativo.Afirmativo[3] = esdrujula(this.table.Subjuntivo.Presente[3].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));
        }
    }

    protected setImperativoNegativo(): void {
        // All regions are formed the same, directly from corresponding subjuntives, insert 'no' after the first pronominal
        [1, 3, 4].forEach(index => this.table.Imperativo.Negativo[index] = this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*)$/, '$1 no $2'));
    }
}

export class Empty extends BaseModel {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }
}
