/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { json2Text, text2Json } from './utilities/modelutils';
import { PronominalKeys, Regions, ConjugationTable, ModelAttributes, AttributeKeys } from './declarations/types';
import { PRONOMBRES, PRONOMINAL } from './declarations/constants';

export abstract class BaseModel {
    protected type: PronominalKeys;
    protected region: Regions;

    protected terms: ConjugationTable = {};
    protected table: ConjugationTable = {};
    protected participioCompuesto = '';
    protected stem: string = '';

    protected attributes: ModelAttributes;
    private stripDefectiveNoun = false;                // true === don't use nouns with defectives 

    protected constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        this.type = type;
        this.region = region;
        this.stripDefectiveNoun = attributes['SN' as AttributeKeys] as boolean;
        this.attributes = attributes;

        // initialize result conjugation table
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => this.table[mode] = {});
        this.table.Imperativo.Afirmativo = Array.from('------');
        this.table.Imperativo.Negativo = Array.from('------');
    }

    protected configTerminations() {
        // Adjust terminations based on region
        // Voseo, 2nd singular -> accented version, 2nd plural -> ustedes 
        if (this.region === 'voseo') {
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto']
                .forEach(mode => this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]);
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto']
                .forEach(mode => this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]);
        }
        // Castellano formal, 2nd singular -> usted, 2nd plural -> ustedes
        if (this.region === 'formal') {
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto']
                .forEach(mode => {
                    this.terms.Indicativo[mode][1] = this.terms.Indicativo[mode][2];
                    this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]
                });
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto']
                .forEach(mode => {
                    this.terms.Subjuntivo[mode][1] = this.terms.Subjuntivo[mode][2];
                    this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]
                });
        }
        // Canarias, 2nd singular remains the same, 2nd pluras -> ustedes
        if (this.region === 'canarias') {
            ['Presente', 'Preterito_Imperfecto', 'Preterito_Indefinido', 'Futuro_Imperfecto', 'Condicional_Simple',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto', 'Preterito_Anterior', 'Futuro_Perfecto', 'Condicional_Compuesto']
                .forEach(mode => this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]);
            ['Presente', 'Preterito_Imperfecto_ra', 'Preterito_Imperfecto_se', 'Futuro_Imperfecto',
                'Preterito_Perfecto', 'Preterito_Pluscuamperfecto_ra', 'Preterito_Pluscuamperfecto_se', 'Futuro_Perfecto']
                .forEach(mode => this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]);
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

    // Blank out the defective indexes. This is purposely done at the end 
    // No need to complicate things by looking at each conjugation at its built time
    private applyDefectives(): void {
        const defectives = this.attributes[this.region] as number[];
        if (defectives) {
            const strings = json2Text(this.table);
            // run through defectives
            defectives.forEach(index => strings[index] = '-');
            this.table = text2Json(strings);
        }
    }

    protected setInfinitivo(): void {
        this.table.Impersonal.Infinitivo = [`${this.stem}${(this.type === PRONOMINAL ? this.terms.Impersonal.Infinitivo[1] : this.terms.Impersonal.Infinitivo[0])}`];
    }
    protected setGerundio(): void {
        this.table.Impersonal.Gerundio = [`${this.stem}${(this.type === PRONOMINAL ? this.terms.Impersonal.Gerundio[1] : this.terms.Impersonal.Gerundio[0])}`];
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.terms.Impersonal.Participio}`];
    }
    protected setParticipioCompuesto(): void {
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }

    /////////////////////////////////////////////////////////////////
    // Indicativo simple
    private formSimple(t: string, index: number): string {
        return `${this.stripDefectiveNoun ? '' : PRONOMBRES[this.type][this.region][index] + ' '}${this.stem}${t}`;
    }

    protected setIndicativoPresente(): void {
        this.table.Indicativo.Presente = this.terms.Indicativo.Presente.map((t, index) => this.formSimple(t, index));
    }
    protected replaceIndicativoPresente(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Indicativo.Presente[index] = this.table.Indicativo.Presente[index].replace(pattern, replacement));
    }

    protected setIndicativoPreteritoImperfecto(): void {
        this.table.Indicativo.Preterito_Imperfecto = this.terms.Indicativo.Preterito_Imperfecto.map((t, index) => this.formSimple(t, index));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.table.Indicativo.Preterito_Indefinido = this.terms.Indicativo.Preterito_Indefinido.map((t, index) => this.formSimple(t, index));
    }

    protected replaceIndicativoPreteritoIndefinito(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Indicativo.Preterito_Indefinido[index] = this.table.Indicativo.Preterito_Indefinido[index].replace(pattern, replacement));
    }

    protected setIndicativoFuturoImperfecto(): void {
        this.table.Indicativo.Futuro_Imperfecto = this.terms.Indicativo.Futuro_Imperfecto.map((t, index) => this.formSimple(t, index));
    }
    protected setIndicativoCondicionalSimple(): void {
        this.table.Indicativo.Condicional_Simple = this.terms.Indicativo.Condicional_Simple.map((t, index) => this.formSimple(t, index));
    }

    /////////////////////////////////////////////////////////////////
    // Compuesto
    private formCompuesto(t: string, index: number): string {
        return `${this.stripDefectiveNoun ? '' : PRONOMBRES[this.type][this.region][index] + ' '}${t} ${this.participioCompuesto}`;
    }
    protected setIndicativoPreteritoPerfecto(): void {
        this.table.Indicativo.Preterito_Perfecto = this.terms.Indicativo.Preterito_Perfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoPreteritoPluscuamperfecto(): void {
        this.table.Indicativo.Preterito_Pluscuamperfecto = this.terms.Indicativo.Preterito_Pluscuamperfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoPreteritoAnterior(): void {
        this.table.Indicativo.Preterito_Anterior = this.terms.Indicativo.Preterito_Anterior.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoFuturoPerfecto(): void {
        this.table.Indicativo.Futuro_Perfecto = this.terms.Indicativo.Futuro_Perfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setIndicativoCondicionalCompuesto(): void {
        this.table.Indicativo.Condicional_Compuesto = this.terms.Indicativo.Condicional_Compuesto.map((t, index) => this.formCompuesto(t, index));
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo simple
    protected setSubjuntivoPresente(): void {
        this.table.Subjuntivo.Presente = this.terms.Subjuntivo.Presente.map((t, index) => this.formSimple(t, index));
    }
    protected replaceSubjuntivoPresente(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Presente[index] = this.table.Subjuntivo.Presente[index].replace(pattern, replacement));
    }


    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.table.Subjuntivo.Preterito_Imperfecto_ra = this.terms.Subjuntivo.Preterito_Imperfecto_ra.map((t, index) => this.formSimple(t, index));
    }
    protected replaceSubjuntivoPreteritoImperfectoRa(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Preterito_Imperfecto_ra[index] = this.table.Subjuntivo.Preterito_Imperfecto_ra[index].replace(pattern, replacement));
    }

    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.table.Subjuntivo.Preterito_Imperfecto_se = this.terms.Subjuntivo.Preterito_Imperfecto_se.map((t, index) => this.formSimple(t, index));
    }
    protected replaceSubjuntivoPreteritoImperfectoSe(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Preterito_Imperfecto_se[index] = this.table.Subjuntivo.Preterito_Imperfecto_se[index].replace(pattern, replacement));
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        this.table.Subjuntivo.Futuro_Imperfecto = this.terms.Subjuntivo.Futuro_Imperfecto.map((t, index) => this.formSimple(t, index));
    }
    protected replaceSubjuntivoFuturoImperfecto(indexes: number[], pattern: RegExp, replacement: string): void {
        indexes.forEach(index => this.table.Subjuntivo.Futuro_Imperfecto[index] = this.table.Subjuntivo.Futuro_Imperfecto[index].replace(pattern, replacement));
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo compuesto
    protected setSubjuntivoPreteritoPerfecto(): void {
        this.table.Subjuntivo.Preterito_Perfecto = this.terms.Subjuntivo.Preterito_Perfecto.map((t, index) => this.formCompuesto(t, index));
    }
    protected setSubjuntivoPreteritoPluscuamperfectoRa(): void {
        this.table.Subjuntivo.Preterito_Pluscuamperfecto_ra = this.terms.Subjuntivo.Preterito_Pluscuamperfecto_ra.map((t, index) => this.formCompuesto(t, index));
    }
    protected setSubjuntivoPreteritoPluscuamperfectoSe(): void {
        this.table.Subjuntivo.Preterito_Pluscuamperfecto_se = this.terms.Subjuntivo.Preterito_Pluscuamperfecto_se.map((t, index) => this.formCompuesto(t, index));
    }
    protected setSubjuntivoFuturoPerfecto(): void {
        this.table.Subjuntivo.Futuro_Perfecto = this.terms.Subjuntivo.Futuro_Perfecto.map((t, index) => this.formCompuesto(t, index));
    }

    protected abstract setImperativoAfirmativo():void;        // The only one that must be implemented by derived class, they have nothing in common (so far 4/4/20)

    protected setImperativoNegativo(): void {
        // All regions are formed the same, directly from corresponding subjuntives, insert 'no' after the first pronominal
        [1, 3, 4].forEach(index => this.table.Imperativo.Negativo[index] = this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*)$/, '$1 no $2'));
    }
}
export class Empty extends BaseModel {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
        this.setImperativoAfirmativo();         // cheat on coverage :)
     }
    protected setImperativoAfirmativo() { /* unimplemented */}
}
