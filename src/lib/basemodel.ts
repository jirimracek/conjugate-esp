/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { PronominalKeys, Regions, ConjugationTable, ModelAttributes, DefectiveType, PronounsTable } from './declarations/types';
import { PRONOUNS, AUX, NO_IMPERATIVO_AFIRMATIVO, NO_IMPERATIVO_NEGATIVO } from './declarations/constants';
import { clearAccents, esdrujula, strongify, applyMonoRules } from './utilities/stringutils';
import { DASH6 } from './declarations/constants';

export abstract class BaseModel {
    protected verb: string;
    protected stem = '';
    protected type: PronominalKeys;
    protected region: Regions;

    protected desinences: ConjugationTable = {};
    protected table: ConjugationTable = {};
    protected participioCompuesto = '';

    protected version: string;
    protected attributes: ModelAttributes;

    private pronouns: PronounsTable = PRONOUNS;
    private auxHaber: ConjugationTable = {};
    private defectiveAttributes: DefectiveType;
    private monoSyllables: boolean;

    protected constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        this.verb = verb;
        this.stem = verb.replace(/..$/, '');
        this.type = type;
        this.region = region;
        this.attributes = attributes;                                     //  exists but empty if there aren't any
        this.defectiveAttributes = attributes['D'] as DefectiveType;      //  undefined if there aren't any 
        this.auxHaber = JSON.parse(JSON.stringify(AUX));
        this.version = (attributes.V ? attributes.V : '0') as string;
        this.monoSyllables = attributes['M'] as boolean;

        // Modify this.pronouns tables as per selected defective attributes
        // Normally we use the PRONOMBRES table.  A few defective forms dictate that the pronouns
        // are not to be used. imper, tercio and terciop
        if (['imper', 'tercio', 'terciop'].includes(this.defectiveAttributes)) {
            // Dup the pronouns object so we don't disturb the constant
            this.pronouns = JSON.parse(JSON.stringify(this.pronouns));
            // fill to-be-unused pronouns with (exactly) 6 blanks
            this.pronouns.N[this.region] = Array.from('      ');   // count them. 6
            this.pronouns.P[this.region] = Array.from('      ');   // count them. 6
        }

        // initialize result conjugation table
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => this.table[mode] = {});
        this.table.Imperativo.Afirmativo = Array.from(DASH6);
        this.table.Imperativo.Negativo = Array.from(DASH6);
    }

    /**
     * Reorder terminations based on the region.  Call in derived class once we have the desinences configured
     * based on verb type.  This is the last step, common to everyone.
     */
    protected remapDesinencesByRegion(): void {
        // Shuffle terminations and auxHaber based on region
        if (this.region === 'voseo') {                      // Voseo, 2nd singular -> accented version, 2nd plural -> ustedes 
            // desinences
            ['Presente', 'PreteritoImperfecto', 'PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple'].forEach(mode =>
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]);
            ['Presente', 'PreteritoImperfectoRa', 'PreteritoImperfectoSe', 'FuturoImperfecto'].forEach(mode =>
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]);

            // auxHaber
            ['PreteritoPerfecto', 'PreteritoPluscuamperfecto', 'PreteritoAnterior', 'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode =>
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]);
            ['PreteritoPerfecto', 'PreteritoPluscuamperfectoRa', 'PreteritoPluscuamperfectoSe', 'FuturoPerfecto'].forEach(mode =>
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]);

        } else if (this.region === 'formal') {               // Castellano formal, 2nd singular -> usted, 2nd plural -> ustedes
            ['Presente', 'PreteritoImperfecto', 'PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple'].forEach(mode => {
                this.desinences.Indicativo[mode][1] = this.desinences.Indicativo[mode][2];
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]
            });
            ['Presente', 'PreteritoImperfectoRa', 'PreteritoImperfectoSe', 'FuturoImperfecto'].forEach(mode => {
                this.desinences.Subjuntivo[mode][1] = this.desinences.Subjuntivo[mode][2];
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]
            });

            ['PreteritoPerfecto', 'PreteritoPluscuamperfecto', 'PreteritoAnterior', 'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode => {
                this.auxHaber.Indicativo[mode][1] = this.auxHaber.Indicativo[mode][2];
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]
            });
            ['PreteritoPerfecto', 'PreteritoPluscuamperfectoRa', 'PreteritoPluscuamperfectoSe', 'FuturoPerfecto'].forEach(mode => {
                this.auxHaber.Subjuntivo[mode][1] = this.auxHaber.Subjuntivo[mode][2];
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]
            });

        } else if (this.region === 'canarias') {             // Canarias, 2nd singular remains the same, 2nd plural -> ustedes
            ['Presente', 'PreteritoImperfecto', 'PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple'].forEach(mode =>
                this.desinences.Indicativo[mode][4] = this.desinences.Indicativo[mode][5]);
            ['Presente', 'PreteritoImperfectoRa', 'PreteritoImperfectoSe', 'FuturoImperfecto'].forEach(mode =>
                this.desinences.Subjuntivo[mode][4] = this.desinences.Subjuntivo[mode][5]);

            ['PreteritoPerfecto', 'PreteritoPluscuamperfecto', 'PreteritoAnterior', 'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode =>
                this.auxHaber.Indicativo[mode][4] = this.auxHaber.Indicativo[mode][5]);
            ['PreteritoPerfecto', 'PreteritoPluscuamperfectoRa', 'PreteritoPluscuamperfectoSe', 'FuturoPerfecto'].forEach(mode =>
                this.auxHaber.Subjuntivo[mode][4] = this.auxHaber.Subjuntivo[mode][5]);
        }
    }

    public getConjugationOf(): ConjugationTable {

        this.setInfinitivo();
        this.setGerundio();
        this.setParticipio();

        this.setIndicativoPresente();
        this.setIndicativoPreteritoImperfecto();
        this.setIndicativoPreteritoIndefinido();
        this.setIndicativoFuturoImperfecto();
        this.setIndicativoCondicionalSimple();

        // Compuestos never get overriden in derived classes
        this.setIndicativoCompuestos();

        this.setSubjuntivoPresente();
        this.setSubjuntivoPreteritoImperfectoRa();
        this.setSubjuntivoPreteritoImperfectoSe();
        this.setSubjuntivoFuturoImperfecto();

        // Compuestos never get overriden in derived classes
        this.setSubjuntivoCompuestos();

        this.applyMono();

        this.setImperativoAfirmativo();
        this.setImperativoNegativo();

        this.applyDefectiveAttributes();

        return this.table;
    }

    private setInfinitivo(): void {
        this.table.Impersonal.Infinitivo = [`${this.stem}${(this.type === 'N' ? this.desinences.Impersonal.Infinitivo[0] : this.desinences.Impersonal.Infinitivo[1])}`];
    }

    protected setGerundio(root?: string): void {
        this.table.Impersonal.Gerundio = [`${root ? root : this.stem}${this.type == 'N' ? this.desinences.Impersonal.Gerundio[0] : this.desinences.Impersonal.Gerundio[1]}`];
    }

    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }

    /////////////////////////////////////////////////////////////////
    // // Indicativo simple
    /**
     * Iterate over desinences table, form a table of conjugations.
     * Called from the base class if the verb stem doesn't change or
     * from derived, which may change stems per each person.  The .trim() is needed for case of missing pronouns (some defectives)
     * 
     * @param roots optional array of verb stems modified by the derived object, if undefined use this.stem
     */
    protected setIndicativoPresente(roots?: string[]): void {
        this.table.Indicativo.Presente = this.desinences.Indicativo.Presente.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }
    protected setIndicativoPreteritoImperfecto(roots?: string[]): void {
        this.table.Indicativo.PreteritoImperfecto = this.desinences.Indicativo.PreteritoImperfecto.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }
    protected setIndicativoPreteritoIndefinido(roots?: string[]): void {
        this.table.Indicativo.PreteritoIndefinido = this.desinences.Indicativo.PreteritoIndefinido.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }
    protected setIndicativoFuturoImperfecto(roots?: string[]): void {
        this.table.Indicativo.FuturoImperfecto = this.desinences.Indicativo.FuturoImperfecto.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }
    protected setIndicativoCondicionalSimple(roots?: string[]): void {
        this.table.Indicativo.CondicionalSimple = this.desinences.Indicativo.CondicionalSimple.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }

    /////////////////////////////////////////////////////////////////
    // Compuesto
    private setIndicativoCompuestos(): void {
        this.table.Indicativo.PreteritoPerfecto = this.auxHaber.Indicativo.PreteritoPerfecto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Indicativo.PreteritoPluscuamperfecto = this.auxHaber.Indicativo.PreteritoPluscuamperfecto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Indicativo.PreteritoAnterior = this.auxHaber.Indicativo.PreteritoAnterior.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Indicativo.FuturoPerfecto = this.auxHaber.Indicativo.FuturoPerfecto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Indicativo.CondicionalCompuesto = this.auxHaber.Indicativo.CondicionalCompuesto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo simple set methods
    protected setSubjuntivoPresente(roots?: string[]): void {
        this.table.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }

    protected setSubjuntivoPreteritoImperfectoRa(roots?: string[]): void {
        this.table.Subjuntivo.PreteritoImperfectoRa = this.desinences.Subjuntivo.PreteritoImperfectoRa.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }

    protected setSubjuntivoPreteritoImperfectoSe(roots?: string[]): void {
        this.table.Subjuntivo.PreteritoImperfectoSe = this.desinences.Subjuntivo.PreteritoImperfectoSe.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }

    protected setSubjuntivoFuturoImperfecto(roots?: string[]): void {
        this.table.Subjuntivo.FuturoImperfecto = this.desinences.Subjuntivo.FuturoImperfecto.map((desinence, index) =>
            `${this.pronouns[this.type][this.region][index]} ${roots ? roots[index] : this.stem}${desinence}`.trim());
    }

    /////////////////////////////////////////////////////////////////
    // Subjuntivo compuestos
    private setSubjuntivoCompuestos(): void {
        this.table.Subjuntivo.PreteritoPerfecto = this.auxHaber.Subjuntivo.PreteritoPerfecto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Subjuntivo.PreteritoPluscuamperfectoRa = this.auxHaber.Subjuntivo.PreteritoPluscuamperfectoRa.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Subjuntivo.PreteritoPluscuamperfectoSe = this.auxHaber.Subjuntivo.PreteritoPluscuamperfectoSe.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
        this.table.Subjuntivo.FuturoPerfecto = this.auxHaber.Subjuntivo.FuturoPerfecto.map((aux, index) =>
            `${this.pronouns[this.type][this.region][index]} ${aux} ${this.participioCompuesto}`.trim());
    }

    // Imperatives
    protected setImperativoAfirmativo(): void {
        if (NO_IMPERATIVO_AFIRMATIVO.includes(this.defectiveAttributes)) {
            return;
        }
        // Castellano
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: tú abandonas             => tú abandona   - drop 's'    
        //   P:                                   tú te abandonas          => tú abandónate - drop 's', switch pronombre te, esdrujula
        // 2nd plural, idx 4:
        //   N: use infinitiv, strip r, add  d:   abandonar                => vosotros abandonar - replace 'r' with 'd'
        //   P:                         add os:   abandonar                => vosotros abandonar - drop 'r', drop accent, make last syllable strong, add 'os' 
        if (this.region === 'castellano') {
            if (this.type === 'N') {
                this.table.Imperativo.Afirmativo[1] = this.table.Indicativo.Presente[1].replace(/s$/, '');
                this.table.Imperativo.Afirmativo[4] = `${this.pronouns.N.castellano[4]} ${this.verb.replace(/r$/, 'd')}`;
            } else {
                this.table.Imperativo.Afirmativo[1] = esdrujula(this.table.Indicativo.Presente[1].replace(/^(.+?) (.*) (.*)s$/, '$1 $3$2'));

                // Tricky. Sounds simple, take infinitive, replace the 'r' with 'os'.  Accents matter
                // Last syllable before 'os' needs to be strong.  Clear accents before strong-ifying 
                // Do use pronouns.N (vosotros), it's not an error
                this.table.Imperativo.Afirmativo[4] = `${this.pronouns.N.castellano[4]} ${strongify(clearAccents(this.verb.replace(/r$/, '')), 1)}os`;
            }
        }

        // Voseo
        // 2nd singular, idx 1:
        //   N: 2nd singular indicativo presente: vos abandonás             => vos abandona   - drop 's'
        //   P:                                   vos te abandonás          => vos abandonate - drop 's', switch pronombre te, drop accent
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
        if (NO_IMPERATIVO_NEGATIVO.includes(this.defectiveAttributes)) {
            return;
        }
        // All regions are formed the same, directly from corresponding subjuntives, insert 'no' after the first pronominal
        [1, 3, 4].forEach(index => this.table.Imperativo.Negativo[index] = this.table.Subjuntivo.Presente[index].replace(/^(.+?) (.*)$/, '$1 no $2'));
    }

    /**
     * When all is done, wead out the defectives.  Not pretty but works
     */
    private applyDefectiveAttributes(): void {
        switch (this.defectiveAttributes) {
            case 'imorfo':
                // use only forms whose desinence starts with i or í, zap the rest
                // Tricky, need to look at the original desinence this was built with
                // Nonpronominal and the desinence doesn't start with ií, nuke
                if (this.type === 'N' && /^[^ií]/.test(this.desinences.Impersonal.Gerundio[0])) {
                    this.table.Impersonal.Gerundio = ['-'];
                } else if (this.type === 'P' && /^[^ií]/.test(this.desinences.Impersonal.Gerundio[1])) {
                    this.table.Impersonal.Gerundio = ['-'];
                }

                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        this.desinences[mode][time].forEach((d, i) => {
                            if (/^[^ií]/.test(d)) {
                                this.table[mode][time][i] = '-';
                            }
                        });
                    });
                });
                // Imperativos zapping time: look at the last word, the next character just past the stem.length.  
                // If it's [ií], let it through, zap otherwise
                [1, 3, 4].forEach(index => {
                    let last = this.table.Imperativo.Afirmativo[index].split(' ').pop();
                    if (last && /^[^ií]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Afirmativo[index] = '-';
                    }
                    last = this.table.Imperativo.Negativo[index].split(' ').pop();
                    if (last && /^[^ií]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Negativo[index] = '-';
                    }
                });
                break;
            case 'eimorfo':     // only ones whose desinence starts with  e or i, zap everything else
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        this.desinences[mode][time].forEach((d, i) => {
                            if (/^[^iíeé]/.test(d)) {
                                this.table[mode][time][i] = '-';
                            }
                        });
                    });
                });
                [1, 3, 4].forEach(index => {
                    let last = this.table.Imperativo.Afirmativo[index].split(' ').pop();
                    if (last && /^[^iíeé]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Afirmativo[index] = '-';
                    }
                    last = this.table.Imperativo.Negativo[index].split(' ').pop();
                    if (last && /^[^iíeé]/.test(last[this.stem.length])) {
                        this.table.Imperativo.Negativo[index] = '-';
                    }
                });
                // for some reason beyond my understanding, the following are also excluded ????
                this.table.Indicativo.PreteritoPerfecto[0] = '-';
                this.table.Subjuntivo.PreteritoPerfecto = Array.from(DASH6);
                break;
            case 'imper': // infinitivo, gerundio, participio y en las terceras personas del singular
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        [0, 1, 3, 4, 5].forEach(index => this.table[mode][time][index] = '-');
                    });
                });
                break;
            case 'tercio':
                // terciopersonal - infinitivo y en terceras personas, simple only??? no compuestos D= tercio
                // Verbo empecer
                ['Gerundio', 'Participio'].forEach(v => this.table.Impersonal[v] = ['-']);
                // Simple indicative
                ['Presente', 'PreteritoImperfecto', 'PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple'].forEach(time =>
                    [0, 1, 3, 4].forEach(i => this.table.Indicativo[time][i] = '-'));

                // Simple subjuntive
                ['Presente', 'PreteritoImperfectoRa', 'PreteritoImperfectoSe', 'FuturoImperfecto'].forEach(time =>
                    [0, 1, 3, 4].forEach(i => this.table.Subjuntivo[time][i] = '-'));

                // Indicative compuesto
                ['PreteritoPerfecto', 'PreteritoPluscuamperfecto', 'PreteritoAnterior', 'FuturoPerfecto', 'CondicionalCompuesto'].forEach(time =>
                    this.table.Indicativo[time] = Array.from(DASH6));    // all 6x
                ['PreteritoPerfecto', 'PreteritoPluscuamperfectoRa', 'PreteritoPluscuamperfectoSe', 'FuturoPerfecto'].forEach(time =>
                    this.table.Subjuntivo[time] = Array.from(DASH6));

                break;

            case 'terciop':
                // terciopersonal, v2 - infinitivo, gerundio, participio y en terceras personas
                // Verbo: acaecer, acontecer
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        [0, 1, 3, 4].forEach(index => this.table[mode][time][index] = '-');
                    });
                });
                break;

            // case 'mmorfo':
            // break;

            case 'bimorfop':        //  bimorfo(p) - sólo en infinitivo y en participio - zap everything else indiscriminantly
                this.table.Impersonal.Gerundio = ['-'];
                ['Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        this.table[mode][time] = Array.from(DASH6);
                    });
                });
                break;

            // case 'bimorfog':
            //     break;

            case 'trimorfo':
                // trimorfo infinitivo y en las segundas personas del imperativo
                // Verbo abar
                ['Gerundio', 'Participio'].forEach(v => this.table.Impersonal[v] = ['-']);

                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        this.table[mode][time] = Array.from(DASH6);
                    });
                });
                ['Imperativo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        [2, 3].forEach(index => this.table[mode][time][index] = '-');
                    });
                });
                break;

            case 'omorfo':
                ['PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple', 'PreteritoAnterior',
                    'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode =>
                        this.table.Indicativo[mode] = Array.from(DASH6));
                ['FuturoImperfecto', 'FuturoPerfecto'].forEach(time => this.table.Subjuntivo[time] = Array.from(DASH6));
                this.table.Imperativo.Negativo[3] = '-';
                break;
            case 'ogmorfo':
                ['Infinitivo', 'Gerundio', 'Participio'].forEach(v => this.table.Impersonal[v] = ['-']);

                ['Presente', 'PreteritoImperfecto', 'FuturoImperfecto', 'CondicionalSimple',
                    'PreteritoPerfecto', 'PreteritoPluscuamperfecto', 'PreteritoAnterior',
                    'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode =>
                        this.table.Indicativo[mode] = Array.from(DASH6));

                ['Presente', 'FuturoImperfecto', 'PreteritoPluscuamperfectoRa', 'PreteritoPluscuamperfectoSe',
                    'FuturoPerfecto', 'PreteritoPerfecto'].forEach(mode => this.table.Subjuntivo[mode] = Array.from(DASH6));

                break;
            case 'osmorfo':
                this.table.Impersonal.Participio = ['-'];

                ['PreteritoIndefinido', 'FuturoImperfecto', 'CondicionalSimple', 'PreteritoPerfecto',
                    'PreteritoPluscuamperfecto', 'PreteritoAnterior', 'FuturoPerfecto', 'CondicionalCompuesto'].forEach(mode =>
                        this.table.Indicativo[mode] = Array.from(DASH6));

                ['FuturoImperfecto', 'PreteritoPerfecto', 'PreteritoPluscuamperfectoRa',
                    'PreteritoPluscuamperfectoSe', 'FuturoPerfecto'].forEach(mode =>
                        this.table.Subjuntivo[mode] = Array.from(DASH6));

                this.table.Imperativo.Negativo[3] = '-';
        }
    }

    private applyMono(): void {
        if (this.monoSyllables) {             // strip monosyllable accents where applicable
            [1, 4].forEach(i => this.table.Indicativo.Presente[i] = applyMonoRules(this.table.Indicativo.Presente[i]));
            [0, 1, 2].forEach(i => this.table.Indicativo.PreteritoIndefinido[i] = applyMonoRules(this.table.Indicativo.PreteritoIndefinido[i]));
            this.table.Subjuntivo.Presente[4] = applyMonoRules(this.table.Subjuntivo.Presente[4]);
        }
    }
}

export class Empty extends BaseModel {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
}
