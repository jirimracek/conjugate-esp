/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { PronominalKeys, Regions, ConjugationTable, ModelAttributes, DefectiveType, PronounsTable } from './declarations/types';
import { PRONOUNS, AUX_HABER, NO_IMPERATIVO_AFIRMATIVO, NO_IMPERATIVO_NEGATIVO } from './declarations/constants';
import { clearAccents, esdrujula, strongify } from './utilities/stringutils';

export abstract class BaseModel {
    protected verb: string;
    protected stem: string = '';
    protected type: PronominalKeys;
    protected region: Regions;
    protected pronouns: PronounsTable = PRONOUNS;

    protected desinences: ConjugationTable = {};
    protected auxHaber: ConjugationTable = {};
    protected table: ConjugationTable = {};
    protected participioCompuesto = '';

    protected attributes: ModelAttributes;
    private defectiveAttributes: DefectiveType;

    protected constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        this.verb = verb;
        this.stem = verb.replace(/..$/, '');
        this.type = type;
        this.region = region;
        this.attributes = attributes;                                     //  exists but empty if there aren't any
        this.defectiveAttributes = attributes['D'] as DefectiveType;    //  undefined if there aren't any 
        this.auxHaber = JSON.parse(JSON.stringify(AUX_HABER));

        // Modify this.pronouns tables as per selected defective attributes
        // Normally we use the PRONOMBRES table.  A few defective form dictate that the pronouns
        // are not to be used. imper, tercio and terciop
        if (['imper', 'tercio', 'terciop'].includes(this.defectiveAttributes)) {
            // Dup the pronouns object so we don't disturb the constant
            this.pronouns = JSON.parse(JSON.stringify(this.pronouns));
            // fill unused pronouns with (exactly) 6 blanks
            (['N', 'P'] as PronominalKeys[]).forEach(pronominalkey => {
                (['castellano', 'voseo', 'formal', 'canarias'] as Regions[]).forEach(region => {
                    this.pronouns[pronominalkey][region] = Array.from('      ');   // count them. 6
                });
            });
        }

        // initialize result conjugation table
        ['Impersonal', 'Indicativo', 'Subjuntivo', 'Imperativo'].forEach(mode => this.table[mode] = {});
        this.table.Imperativo.Afirmativo = Array.from('------');
        this.table.Imperativo.Negativo = Array.from('------');
    }

    /**
     * Reorder terminations based on the region.  Call in derived class once we have the desinences configured
     * based on verb type.  This is the last step, common to everyone.
     */
    protected setDesinencesByRegion() {
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

        // Once the desinances are configured, setup attributes that need to be setup before conjugation
        // In particular, the once that affect desinences. Again.
        this.applyAttributesPre();
    }
    /**
     * Some attributes need to be processed before we conjugate, others after, some before and after :(
     */
    protected applyAttributesPre(): void {
        // Apply defective rules, if any, to desinences.  Basically we replace the invalid desinence with a '-'
        // When constructing a word, if desinence === '-', the whole expression gets '-'
        // {d:imorfo|eimorfo|imper|tercio|terciop|mmorfo|bimorfop|bimorfog|trimorfo|omorfo|omorfos}

        // Ex: imorfo rules - formas cuya desinencia empieza por la vocal 'i'
        // this means that ***before we conjugate, we need to identify the defective versions*** by looking
        // at the desinence table.  The desinence table gets built by the base class and refined by
        // derived classes.  So we can't really do this in constructor but it needs to happen before 
        // the conjugation functions chain gets applied
        // all singles that don't start with i get replaced with '-'
        switch (this.defectiveAttributes) {
            case 'imorfo':     // formas cuya desinencia empieza por la vocal -i, i.e. ignore the rest
                // this.desinences.Impersonal.Infinitivo = this.desinences.Impersonal.Infinitivo.map(d => /^[ií]/.test(d) ? d : '-');
                this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.map(d => /^[ií]/.test(d) ? d : '-');
                // this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.map(d => /^[ií]/.test(d) ? d : '-');
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        this.desinences[mode][time] = this.desinences[mode][time].map(d => /^[ií]/.test(d) ? d : '-');
                    });
                });
                break;
            case 'eimorfo':     // desinencia empieza por la vocal -e o por la -i, zap everything else
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        this.desinences[mode][time] = this.desinences[mode][time].map(d => /^[iíeé]/.test(d) ? d : '-');
                    });
                });
                // for some reason beyond my understanding, the following are also excluded ????
                this.auxHaber.Indicativo.Preterito_Perfecto[0] = '-';
                this.auxHaber.Subjuntivo.Preterito_Perfecto = Array.from('------');
                break;
            case 'imper': // infinitivo, gerundio, participio y en las terceras personas del singular
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        [0, 1, 3, 4, 5].forEach(index => this.desinences[mode][time][index] = '-');
                    });
                    Object.keys(this.auxHaber[mode]).forEach(time => {
                        [0, 1, 3, 4, 5].forEach(index => this.auxHaber[mode][time][index] = '-');
                    });
                });
                break;
            case 'tercio':
                // terciopersonal - infinitivo y en terceras personas, simple only??? no compuestos D = tercio
                // this needs to be done partly pre (here - to separate singles from compuestos) 
                //                   and partly post to zap gerundio & participio after we're done
                // Verbo empecer
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        [0, 1, 3, 4].forEach(index => this.desinences[mode][time][index] = '-');
                    });
                    Object.keys(this.auxHaber[mode]).forEach(time => {
                        [0, 1, 2, 3, 4, 5].forEach(index => this.auxHaber[mode][time][index] = '-');
                    });
                });
                break;
            case 'terciop':
                // terciopersonal, v2 - infinitivo, gerundio, participio y en terceras personas
                // Verbo: acaecer, acontecer
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        [0, 1, 3, 4].forEach(index => this.desinences[mode][time][index] = '-');
                    });
                    Object.keys(this.auxHaber[mode]).forEach(time => {
                        [0, 1, 3, 4].forEach(index => this.auxHaber[mode][time][index] = '-');
                    });
                });
                break;
            // case 'mmorfo':
            //     break;
            case 'bimorfop':        //  bimorfo(p) - sólo en infinitivo y en participio - zap everything else indiscriminantly
                this.desinences.Impersonal.Gerundio = ['-', '-'];
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.desinences[mode]).forEach(time => {
                        [0, 1, 2, 3, 4, 5].forEach(index => this.desinences[mode][time][index] = '-');
                    });
                    Object.keys(this.auxHaber[mode]).forEach(time => {
                        [0, 1, 2, 3, 4, 5].forEach(index => this.auxHaber[mode][time][index] = '-');
                    });
                });
                break;
            // case 'bimorfog':
            //     break;
            // case 'trimorfo':
            //     break;
            // oligomorfo - infinitivo, participio, gerundio, en los presentes y los pretéritos imperfectos de indicativo y subjuntivo, y 
            //              en algunos tiempos compuestos.  Kill future, condicional, imperativos, 
            // case 'omorfo':   do it in post
                // break;
            // case 'ogmorfo': // oligomorfo, v2 -  pretérito perfecto simple de indicativo y en el pretérito imperfecto de subjuntivo: nuke everything else: reponer:D=ogmorfo
            //     break;      do it in post
            // case 'osmorfo':
            //     break;
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

        this.applyAttributesPost();

        return this.table;
    }


    protected setInfinitivo(): void {
        this.table.Impersonal.Infinitivo = [`${this.stem}${(this.type === 'P' ? this.desinences.Impersonal.Infinitivo[1] : this.desinences.Impersonal.Infinitivo[0])}`];
    }
    protected setGerundio(root?: string): void {
        if (this.type === 'N' && this.desinences.Impersonal.Gerundio[0] !== '-') {
            this.table.Impersonal.Gerundio = [`${root ? root : this.stem}${this.desinences.Impersonal.Gerundio[0]}`];
        } else if (this.type === 'P' && this.desinences.Impersonal.Gerundio[1] !== '-') {
            this.table.Impersonal.Gerundio = [`${root ? root : this.stem}${this.desinences.Impersonal.Gerundio[1]}`];
        } else {
            this.table.Impersonal.Gerundio = ['-'];
        }
    }
    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }

    /////////////////////////////////////////////////////////////////
    // Indicativo simple
    /**
     * Compose simple (not compuesto) mode-time-person region conjugated expression, 
     * join pronoun + verb stem + desinence.  
     * If desinence is defective ('-'), return a blank ('-')
     * @param desinence this person's desinence
     * @param index this person's index in the pronouns table
     * @param root root of the verb / verb stem.  Optional, if not provided, the verb default is used
     */
    private formSimple(desinence: string, index: number, root?: string): string {
        if (desinence !== '-') {
            return `${this.pronouns[this.type][this.region][index]} ${root ? root : this.stem}${desinence}`.trim();
        }
        return '-';
    }

    /**
     * Iterate over desinences table, form a table of conjugations.
     * Called from the base class if the verb stem doesn't change or
     * from derived, which may change stems per each person.
     * 
     * @param roots optional array of verb stems modified by the derived object, if undefined, formSimple will use this.stem
     */
    protected setIndicativoPresente(roots?: string[]): void {
        this.table.Indicativo.Presente =
            this.desinences.Indicativo.Presente.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }
    protected setIndicativoPreteritoImperfecto(): void {
        this.table.Indicativo.Preterito_Imperfecto =
            this.desinences.Indicativo.Preterito_Imperfecto.map((desinence, index) => this.formSimple(desinence, index));
    }
    protected setIndicativoPreteritoIndefinido(roots?: string[]): void {
        this.table.Indicativo.Preterito_Indefinido =
            this.desinences.Indicativo.Preterito_Indefinido.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }
    protected setIndicativoFuturoImperfecto(roots?: string[]): void {
        this.table.Indicativo.Futuro_Imperfecto =
            this.desinences.Indicativo.Futuro_Imperfecto.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }
    protected setIndicativoCondicionalSimple(roots?: string[]): void {
        this.table.Indicativo.Condicional_Simple =
            this.desinences.Indicativo.Condicional_Simple.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
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
    protected setSubjuntivoPresente(roots?: string[]): void {
        this.table.Subjuntivo.Presente =
            this.desinences.Subjuntivo.Presente.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }
    protected setSubjuntivoPreteritoImperfectoRa(roots?: string[]): void {
        this.table.Subjuntivo.Preterito_Imperfecto_ra =
            this.desinences.Subjuntivo.Preterito_Imperfecto_ra.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }

    protected setSubjuntivoPreteritoImperfectoSe(roots?: string[]): void {
        this.table.Subjuntivo.Preterito_Imperfecto_se =
            this.desinences.Subjuntivo.Preterito_Imperfecto_se.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
    }
    protected setSubjuntivoFuturoImperfecto(roots?: string[]): void {
        this.table.Subjuntivo.Futuro_Imperfecto =
            this.desinences.Subjuntivo.Futuro_Imperfecto.map((desinence, index) => this.formSimple(desinence, index, roots ? roots[index] : roots));
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
                // Do use pronouns.N (vosotros)
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

    private applyAttributesPost(): void {
        switch (this.defectiveAttributes) {
            // case 'imorfo':     // formas cuya desinencia empieza por la vocal -i
            //     break;
            // case 'eimorfo':
            //     break;
            // case 'imper': // infinitivo, gerundio, participio y en las terceras personas del singular
            //     break;
            case 'tercio':
                // terciopersonal - infinitivo y en terceras personas, simple only??? no compuestos D= tercio
                // this needs to be done partly pre (above) to separate singles from compuestos
                //                   and partly post (here) to zap gerundio & participio after we're done
                // Verbo empecer
                this.table.Impersonal.Gerundio = ['-'];
                this.table.Impersonal.Participio = ['-'];
                break;
            // case 'terciop':
            //     break;
            // case 'mmorfo':
            //     break;
            // case 'bimorfop':   //  bimorfo(p) - sólo en infinitivo y en participio - zap everything else indiscriminantly
            // this.table.Impersonal.Gerundio = ['-'];
            // ['Indicativo', 'Subjuntivo'].forEach(mode => {
            //     Object.keys(this.table[mode]).forEach(time => {
            //         [0, 1, 2, 3, 4, 5].forEach(index => this.table[mode][time][index] = '-');
            //     });
            // });
            // break;
            // case 'bimorfog':
            //     break;
            case 'trimorfo':
                // trimorfo infinitivo y en las segundas personas del imperativo
                // this can not all be done pre because we need to build subjuntives to build imperatives
                // so we prune everything after it gets built
                // Verbo abar
                this.table.Impersonal.Gerundio = ['-'];
                this.table.Impersonal.Participio = ['-'];
                ['Indicativo', 'Subjuntivo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        [0, 1, 2, 3, 4, 5].forEach(index => this.table[mode][time][index] = '-');
                    });
                });
                ['Imperativo'].forEach(mode => {
                    Object.keys(this.table[mode]).forEach(time => {
                        [2, 3].forEach(index => this.table[mode][time][index] = '-');
                    });
                });
                break;
            case 'omorfo':
                this.table.Indicativo.Preterito_Indefinido = Array.from('------');
                this.table.Indicativo.Futuro_Imperfecto = Array.from('------');
                this.table.Indicativo.Condicional_Simple = Array.from('------');
                this.table.Subjuntivo.Futuro_Imperfecto = Array.from('------');

                this.table.Indicativo.Preterito_Anterior = Array.from('------');
                this.table.Indicativo.Futuro_Perfecto = Array.from('------');
                this.table.Indicativo.Condicional_Compuesto = Array.from('------');
                this.table.Subjuntivo.Futuro_Perfecto = Array.from('------');
                this.table.Imperativo.Negativo[3] = '-';
                break;
            case 'ogmorfo':
                this.table.Impersonal.Infinitivo = ['-'];
                this.table.Impersonal.Gerundio = ['-'];
                this.table.Impersonal.Participio = ['-'];

                this.table.Indicativo.Presente = Array.from('------');
                // this.table.Indicativo.Preterito_Indefinido = Array.from('------');
                this.table.Indicativo.Preterito_Imperfecto = Array.from('------');
                this.table.Indicativo.Futuro_Imperfecto = Array.from('------');
                this.table.Indicativo.Condicional_Simple = Array.from('------');
                this.table.Indicativo.Preterito_Perfecto = Array.from('------');
                this.table.Indicativo.Preterito_Pluscuamperfecto = Array.from('------');
                this.table.Indicativo.Preterito_Anterior = Array.from('------');
                this.table.Indicativo.Futuro_Perfecto = Array.from('------');
                this.table.Indicativo.Condicional_Compuesto = Array.from('------');

                this.table.Subjuntivo.Presente = Array.from('------');
                this.table.Subjuntivo.Futuro_Imperfecto = Array.from('------');
                this.table.Subjuntivo.Preterito_Pluscuamperfecto_ra = Array.from('------');
                this.table.Subjuntivo.Preterito_Pluscuamperfecto_se = Array.from('------');
                this.table.Subjuntivo.Futuro_Perfecto = Array.from('------');
                this.table.Subjuntivo.Preterito_Perfecto = Array.from('------');
                break;
            case 'osmorfo':
                this.table.Impersonal.Participio = ['-'];
                this.table.Indicativo.Preterito_Indefinido = Array.from('------');
                this.table.Indicativo.Futuro_Imperfecto = Array.from('------');
                this.table.Indicativo.Condicional_Simple = Array.from('------');
                this.table.Indicativo.Preterito_Perfecto = Array.from('------');
                this.table.Indicativo.Preterito_Pluscuamperfecto = Array.from('------');
                this.table.Indicativo.Preterito_Anterior = Array.from('------');
                this.table.Indicativo.Futuro_Perfecto = Array.from('------');
                this.table.Indicativo.Condicional_Compuesto = Array.from('------');

                this.table.Subjuntivo.Futuro_Imperfecto = Array.from('------');
                this.table.Subjuntivo.Preterito_Perfecto = Array.from('------');
                this.table.Subjuntivo.Preterito_Pluscuamperfecto_ra = Array.from('------');
                this.table.Subjuntivo.Preterito_Pluscuamperfecto_se = Array.from('------');
                this.table.Subjuntivo.Futuro_Perfecto = Array.from('------');

                this.table.Imperativo.Negativo[3] = '-';
                break;
        }
    }
}

export class Empty extends BaseModel {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
}
