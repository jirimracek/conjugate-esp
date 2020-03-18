/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { ModelInterface, TableType, V2M_PronType, V2M_AttrType, FormatType, InfoType, PRONOMINAL, PRONOMBRES } from './interfaces';
import { RegionType } from './interfaces';

export class Model implements ModelInterface{
    protected alias: string;
    protected type: V2M_PronType;
    protected region: RegionType;
    protected attributes: V2M_AttrType;

    protected terms: TableType = {};
    protected table: TableType = {}; 
    protected participioCompuesto = '';
    protected stem: string = '';
    protected info: InfoType = <InfoType>{};

    protected constructor(alias: string, type: V2M_PronType, region: RegionType, attributes: V2M_AttrType ) {
        this.alias = alias;
        this.type = type;
        this.region = region;
        this.attributes = attributes;

        // initialize resulting conjugation table
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => this.table[mode] = {});

        ['Infinitivo', 'Gerundio', 'Participio'].forEach(type => this.table['Impersonal'][type] = []);

        ['Presente', 'Pretérito Imperfecto', 'Pretérito Indefinido', 'Futuro Imperfecto', 'Condicional Simple',
            'Pretérito Perfecto', 'Pretérito Pluscuamperfecto', 'Pretérito Anterior',
            'Futuro Perfecto', 'Condicional Compuesto'].forEach(time => this.table['Indicativo'][time] = []);

        ['Presente', 'Pretérito Imperfecto -ra', 'Pretérito Imperfecto -se', 'Futuro Imperfecto',
            'Pretérito Perfecto', 'Pretérito Pluscuamperfecto -ra', 'Pretérito Pluscuamperfecto -se',
            'Futuro Perfecto'].forEach(time => this.table['Subjuntivo'][time] = []);

        ['Afirmativo', 'Negativo'].forEach(imperativo => this.table['Imperativo'][imperativo] = []);

    }

    protected setTerminationTable () {
        // Adjust terminations based on region
        // Voseo, 2nd singular -> accented version, 2nd plural -> ustedes 
        if (this.region === 'voseo') {
            ['Presente', 'Pretérito Imperfecto', 'Pretérito Indefinido', 'Futuro Imperfecto', 'Condicional Simple',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto', 'Pretérito Anterior', 'Futuro Perfecto', 'Condicional Compuesto']
                .forEach(mode => this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]);
            ['Presente', 'Pretérito Imperfecto -ra', 'Pretérito Imperfecto -se', 'Futuro Imperfecto',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto -ra', 'Pretérito Pluscuamperfecto -se', 'Futuro Perfecto']
                .forEach(mode => this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]);
        }
        // Castellano formal, 2nd singular -> usted, 2nd plural -> ustedes
        if (this.region === 'formal') {
            ['Presente', 'Pretérito Imperfecto', 'Pretérito Indefinido', 'Futuro Imperfecto', 'Condicional Simple',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto', 'Pretérito Anterior', 'Futuro Perfecto', 'Condicional Compuesto']
                .forEach(mode => {
                    this.terms.Indicativo[mode][1] = this.terms.Indicativo[mode][2];
                    this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]
                });
            ['Presente', 'Pretérito Imperfecto -ra', 'Pretérito Imperfecto -se', 'Futuro Imperfecto',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto -ra', 'Pretérito Pluscuamperfecto -se', 'Futuro Perfecto']
                .forEach(mode => {
                    this.terms.Subjuntivo[mode][1] = this.terms.Subjuntivo[mode][2];
                    this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]
                });
        }
        // Canarias, 2nd singular remains the same, 2nd pluras -> ustedes
        if (this.region === 'canarias') {
            ['Presente', 'Pretérito Imperfecto', 'Pretérito Indefinido', 'Futuro Imperfecto', 'Condicional Simple',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto', 'Pretérito Anterior', 'Futuro Perfecto', 'Condicional Compuesto']
                .forEach(mode => this.terms.Indicativo[mode][4] = this.terms.Indicativo[mode][5]);
            ['Presente', 'Pretérito Imperfecto -ra', 'Pretérito Imperfecto -se', 'Futuro Imperfecto',
                'Pretérito Perfecto', 'Pretérito Pluscuamperfecto -ra', 'Pretérito Pluscuamperfecto -se', 'Futuro Perfecto']
                .forEach(mode => this.terms.Subjuntivo[mode][4] = this.terms.Subjuntivo[mode][5]);
        }

        this.terms.Imperativo['Afirmativo'] = [];
        this.terms.Imperativo['Negativo'] = [];
    }

    public getConjugationOf(verb: string, format: FormatType): TableType | string[] {
        this.stem = verb.replace(/..$/, '');

        this.setInfinitivo();
        this.setGerundio();
        this.setParticipio();
        this.setParticipioCompuesto();

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

        this.setImperativoAfirmativo();
        this.setImperativoNegativo();

        if (this.attributes.length > 0 ) {
            const strings = this.json2Text(this.table);
            // run through defectives
            this.attributes.forEach(defectiveIndex => strings[defectiveIndex] = '-');
            if (format === 'text') {
                return strings;
            }
            return this.text2Json(strings);
        }

        if (format === 'text') {
            return this.json2Text(this.table);
        }

        return this.table;
    }

    protected setInfinitivo(): void {
        this.table.Impersonal.Infinitivo = [`${this.stem}${(this.type === PRONOMINAL ? this.terms.Impersonal.Infinitivo[1] : this.terms.Impersonal.Infinitivo[0])}`];
        // this.table.Impersonal.Infinitivo.push(`${this.stem}${(this.type === PRONOMINAL ? this.terms.Impersonal.Infinitivo[1] : this.terms.Impersonal.Infinitivo[0])}`);
    }
    protected setGerundio(): void {
        this.table.Impersonal.Gerundio = [`${this.stem}${(this.type === PRONOMINAL ? this.terms.Impersonal.Gerundio[1] : this.terms.Impersonal.Gerundio[0])}`];
    }
    protected setParticipioCompuesto(): void {
        this.participioCompuesto = `${this.stem}${this.terms.Impersonal['Participio']}`;
    }
    protected setParticipio(): void {
        this.table.Impersonal['Participio'] = [`${this.stem}${this.terms.Impersonal['Participio']}`];
    }

    protected setIndicativoPresente(): void {
        this.table.Indicativo['Presente'] = this.terms.Indicativo['Presente'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setIndicativoPreteritoImperfecto(): void {
        this.table.Indicativo['Pretérito Imperfecto'] = this.terms.Indicativo['Pretérito Imperfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        this.table.Indicativo['Pretérito Indefinido'] = this.terms.Indicativo['Pretérito Indefinido'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setIndicativoFuturoImperfecto(): void {
        this.table.Indicativo['Futuro Imperfecto'] = this.terms.Indicativo['Futuro Imperfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setIndicativoCondicionalSimple(): void {
        this.table.Indicativo['Condicional Simple'] = this.terms.Indicativo['Condicional Simple'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }

    // Compuestos
    protected setIndicativoPreteritoPerfecto(): void {
        this.table.Indicativo['Pretérito Perfecto'] = this.terms.Indicativo['Pretérito Perfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setIndicativoPreteritoPluscuamperfecto(): void {
        this.table.Indicativo['Pretérito Pluscuamperfecto'] = this.terms.Indicativo['Pretérito Pluscuamperfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setIndicativoPreteritoAnterior(): void {
        this.table.Indicativo['Pretérito Anterior'] = this.terms.Indicativo['Pretérito Anterior'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setIndicativoFuturoPerfecto(): void {
        this.table.Indicativo['Futuro Perfecto'] = this.terms.Indicativo['Futuro Perfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setIndicativoCondicionalCompuesto(): void {
        this.table.Indicativo['Condicional Compuesto'] = this.terms.Indicativo['Condicional Compuesto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }

    protected setSubjuntivoPresente(): void {
        this.table.Subjuntivo['Presente'] = this.terms.Subjuntivo['Presente'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        this.table.Subjuntivo['Pretérito Imperfecto -ra'] = this.terms.Subjuntivo['Pretérito Imperfecto -ra'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        this.table.Subjuntivo['Pretérito Imperfecto -se'] = this.terms.Subjuntivo['Pretérito Imperfecto -se'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        this.table.Subjuntivo['Futuro Imperfecto'] = this.terms.Subjuntivo['Futuro Imperfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${this.stem}${t}`);
    }

    protected setSubjuntivoPreteritoPerfecto(): void {
        this.table.Subjuntivo['Pretérito Perfecto'] = this.terms.Subjuntivo['Pretérito Perfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setSubjuntivoPreteritoPluscuamperfectoRa(): void {
        this.table.Subjuntivo['Pretérito Pluscuamperfecto -ra'] = this.terms.Subjuntivo['Pretérito Pluscuamperfecto -ra'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setSubjuntivoPreteritoPluscuamperfectoSe(): void {
        this.table.Subjuntivo['Pretérito Pluscuamperfecto -se'] = this.terms.Subjuntivo['Pretérito Pluscuamperfecto -se'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }
    protected setSubjuntivoFuturoPerfecto(): void {
        this.table.Subjuntivo['Futuro Perfecto'] = this.terms.Subjuntivo['Futuro Perfecto'].map((t, index) => `${PRONOMBRES[this.type][this.region][index]} ${t} ${this.participioCompuesto}`);
    }

    protected setImperativoAfirmativo(): void {}

    protected setImperativoNegativo() {
        // All: 1,3,6 person: => '-'
        [0, 2, 5].forEach(index => this.table.Imperativo.Negativo[index] = '-');

        // All regions are formed the same, directly from corresponding subjuntives, insert 'no' after the first pronominal
        [1, 3, 4].forEach(index => this.table.Imperativo.Negativo[index] = this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*)$/, '$1 no $2'));
    }

    /**
     * 
     * @param table 
     */
    protected json2Text(table: TableType): string[] {
        const retVal: string[] = [];
            retVal.push(... Object.values(table).map(mode =>
                Object.values(mode).map(time => time)).flat(2));
        return retVal;
    }

    protected text2Json(table: string[]): TableType {
        const retVal: TableType = {};
        const temp = table.map(m => m);   // Make a copy so it doesn't get overwritten

        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => retVal[mode] = {});

        ['Infinitivo', 'Gerundio', 'Participio'].forEach(type => retVal['Impersonal'][type] = [temp.shift() as string]);

        ['Presente', 'Pretérito Imperfecto', 'Pretérito Indefinido', 'Futuro Imperfecto', 'Condicional Simple',
            'Pretérito Perfecto', 'Pretérito Pluscuamperfecto', 'Pretérito Anterior',
            'Futuro Perfecto', 'Condicional Compuesto'].forEach(time => retVal['Indicativo'][time] = temp.splice(0,6));

        ['Presente', 'Pretérito Imperfecto -ra', 'Pretérito Imperfecto -se', 'Futuro Imperfecto',
            'Pretérito Perfecto', 'Pretérito Pluscuamperfecto -ra', 'Pretérito Pluscuamperfecto -se',
            'Futuro Perfecto'].forEach(time => retVal['Subjuntivo'][time] = temp.splice(0,6));

        ['Afirmativo', 'Negativo'].forEach(imperativo => retVal['Imperativo'][imperativo] = temp.splice(0,6));

        return retVal;
    }
}

