/* eslint-disable @typescript-eslint/class-name-casing */
/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { ER } from './declarations/constants';

export class temer extends BaseModel {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(ER));
        this.configDesinences();
        this.remapDesinencesByRegion();
    }

    protected configDesinences(): void {
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'és';
        }
    }
    // Repeated pattern of indicativo presente stem modifications
    // The matrix looks like this
    //     person: 0 1 2 3 4 5     
    // castellano: . . .     .
    //      voseo: .   .   . .
    //  can & for: . . .   . . 
    // eslint-disable-next-line @typescript-eslint/camelcase
    protected setIndicativoPresentePattern_0125(replacement: string): void {
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, this.stem, replacement]);
                break;
            case 'voseo':
                super.setIndicativoPresente([replacement, this.stem, replacement, this.stem, replacement, replacement]);
                break;
            case 'canarias':
            case 'formal':
                super.setIndicativoPresente([replacement, replacement, replacement, this.stem, replacement, replacement]);
                break;
        }
    }
    // Corresponding subj. presente patterns
    //            person: 0 1 2 3 4 5     
    //        castellano: . . .     .
    // voseo & can & for: . . .   . . 
    // eslint-disable-next-line @typescript-eslint/camelcase
    protected setSubjuntivoPresentePattern_0125(replacement: string): void {
        switch (this.region) {
            case 'castellano':
                super.setSubjuntivoPresente([replacement, replacement, replacement, this.stem, this.stem, replacement]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setSubjuntivoPresente([replacement, replacement, replacement, this.stem, replacement, replacement]);
                break;
        }
    }
}

export class hacer extends temer {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/acid/, 'ech')];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían']
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.stem.replace(/c$/, 'g'), ...Array.from('12345').map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        const replacement = this.stem.replace(/(.*)a/, '$1i');
        const replacementAcIz = this.stem.replace(/ac$/, 'iz');
        switch (this.region) {
            default:
                super.setIndicativoPreteritoIndefinido([replacement, replacement, replacementAcIz, replacement, replacement, replacement]);
                break;
            case 'formal':
                super.setIndicativoPreteritoIndefinido([replacement, replacementAcIz, replacementAcIz, replacement, replacement, replacement]);
        }
    }
    protected setIndicativoFuturoImperfecto(): void {
        const replacement = this.stem.replace(/c$/, '');
        super.setIndicativoFuturoImperfecto(Array.from('012345').map(() => replacement));
    }
    protected setIndicativoCondicionalSimple(): void {
        const replacement = this.stem.replace(/c$/, '');
        super.setIndicativoCondicionalSimple(Array.from('012345').map(() => replacement));
    }

    protected setSubjuntivoPresente(): void {
        const replacement = this.stem.replace(/c$/, 'g');
        super.setSubjuntivoPresente(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const replacement = this.stem.replace(/(.*)a/, '$1i');
        super.setSubjuntivoPreteritoImperfectoRa(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const replacement = this.stem.replace(/(.*)a/, '$1i');
        super.setSubjuntivoPreteritoImperfectoSe(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        const replacement = this.stem.replace(/(.*)a/, '$1i');
        super.setSubjuntivoFuturoImperfecto(Array.from('012345').map(() => replacement));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        switch (this.region) {
            case 'castellano':
            case 'canarias':
                if (this.version === '0') {
                    this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/[aá]ce/, 'az');
                }
        }
    }
}
export class haber extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Presente = ['e', 'as', 'a', 'emos', 'éis', 'an'];
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían']
    }
    protected setIndicativoPresente(): void {
        const replacement = this.stem.replace(/ab/, '');
        switch (this.region) {
            case 'castellano':
                super.setIndicativoPresente([replacement, replacement, replacement, replacement, this.stem, replacement]);
                break;
            case 'voseo':
            case 'canarias':
            case 'formal':
                super.setIndicativoPresente(Array.from('012345').map(() => replacement));
                break;
        }
    }
    protected setIndicativoPreteritoIndefinido(): void {
        const replacement = this.stem.replace(/a/, 'u');
        super.setIndicativoPreteritoIndefinido(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoPresente(): void {
        const replacement = this.stem.replace(/b/, 'y');
        super.setSubjuntivoPresente(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        const replacement = this.stem.replace(/a/, 'u');
        super.setSubjuntivoPreteritoImperfectoRa(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        const replacement = this.stem.replace(/a/, 'u');
        super.setSubjuntivoPreteritoImperfectoSe(Array.from('012345').map(() => replacement));
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        const replacement = this.stem.replace(/a/, 'u');
        super.setSubjuntivoFuturoImperfecto(Array.from('012345').map(() => replacement));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        switch (this.region) {
            case 'castellano':
            case 'voseo':
            case 'canarias':
                this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/a/, 'e');
                break;
        }
    }
}

export class mover extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)o/, '$1ue');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class nacer extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/s?c$/, 'zc');
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }

    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
}

export class placer extends temer {
    private replacement: string;

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/c$/, 'zc');
    }

    protected configDesinences(): void {
        super.configDesinences();
        if (this.version === '1') {
            this.desinences.Indicativo.PreteritoIndefinido[2] = this.desinences.Indicativo.PreteritoIndefinido[2].replace(/ió/, 'o');
        }
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, ...Array.from('12345').map(() => this.stem)]);
    }

    protected setIndicativoPreteritoIndefinido(): void {
        if (this.version === '0') {
            super.setIndicativoPreteritoIndefinido();
        } else {
            const local = this.stem.replace(/ac/, 'ug');
            if (this.region === 'formal') {
                super.setIndicativoPreteritoIndefinido([this.stem, local, local, this.stem, this.stem, this.stem]);
            } else {
                super.setIndicativoPreteritoIndefinido([this.stem, this.stem, local, this.stem, this.stem, this.stem]);
            }
        }
    }

    protected setSubjuntivoPresente(): void {
        if (this.version === '0') {
            super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
        } else {
            const local = this.stem.replace(/ac/, 'eg');
            if (this.region === 'formal') {
                super.setSubjuntivoPresente([this.replacement, local, local, this.replacement, this.replacement, this.replacement]);
            } else {
                super.setSubjuntivoPresente([this.replacement, this.replacement, local, this.replacement, this.replacement, this.replacement]);
            }
        }
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        if (this.version === '0') {
            super.setSubjuntivoPreteritoImperfectoRa();
        } else {
            const local = this.stem.replace(/ac/, 'ugu');
            if (this.region === 'formal') {
                super.setSubjuntivoPreteritoImperfectoRa([this.stem, local, local , this.stem, this.stem, this.stem]);
            } else {
                super.setSubjuntivoPreteritoImperfectoRa([this.stem, this.stem, local, this.stem, this.stem, this.stem]);
            }
        }
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        if (this.version === '0') {
            super.setSubjuntivoPreteritoImperfectoSe();
        } else {
            if (this.region === 'formal') {
                super.setSubjuntivoPreteritoImperfectoSe([this.stem, ...Array.from('12').map(() => this.stem.replace(/ac/, 'ugu')), ...Array.from('345').map(() => this.stem)]);
            } else {
                super.setSubjuntivoPreteritoImperfectoSe([...Array.from('01').map(() => this.stem), this.stem.replace(/ac/, 'ugu'), ...Array.from('345').map(() => this.stem)]);
            }
        }
    }

    protected setSubjuntivoFuturoImperfecto(): void {
        if (this.version === '0') {
            super.setSubjuntivoFuturoImperfecto();
        } else {
            if (this.region === 'formal') {
                super.setSubjuntivoFuturoImperfecto([this.stem, ...Array.from('12').map(() => this.stem.replace(/ac/, 'ugu')), ...Array.from('345').map(() => this.stem)]);
            } else {
                super.setSubjuntivoFuturoImperfecto([...Array.from('01').map(() => this.stem), this.stem.replace(/ac/, 'ugu'), ...Array.from('345').map(() => this.stem)]);
            }
        }
    }

}

export class poder extends temer {
    private replacement: string;
    private replacements: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/o/, 'u');
        this.replacements = Array.from('012345').map(() => this.replacement);
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían'];
    }

    protected setGerundio(): void {
        super.setGerundio(this.replacement);
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.stem.replace(/o/, 'ue'));
    }
    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido(Array.from('012345').map(() => this.replacement));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.stem.replace(/o/, 'ue'));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        super.setSubjuntivoPreteritoImperfectoRa(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        super.setSubjuntivoPreteritoImperfectoSe(this.replacements);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        super.setSubjuntivoFuturoImperfecto(this.replacements);
    }
}
export class poner extends temer {
    private replacement: string;
    private replacements: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/on$/, 'us');
        this.replacements = Array.from('012345').map(() => this.replacement);
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.Presente[0] = 'go';
        this.desinences.Indicativo.PreteritoIndefinido = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['dré', 'drás', 'drá', 'dremos', 'dréis', 'drán'];
        this.desinences.Indicativo.CondicionalSimple = ['dría', 'drías', 'dría', 'dríamos', 'dríais', 'drían'];
    }

    protected setParticipio(): void {
        this.table.Impersonal.Participio = [`${this.stem}${this.desinences.Impersonal.Participio}`.replace(/onid/, 'uest')];
        this.participioCompuesto = this.table.Impersonal.Participio[0];
    }
    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido(Array.from('012345').map(() => this.replacement));
    }
    protected setSubjuntivoPresente(): void {
        const replace = this.stem.replace(/on$/, 'ong');
        super.setSubjuntivoPresente(Array.from('012345').map(() => replace));
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        super.setSubjuntivoPreteritoImperfectoRa(this.replacements);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        super.setSubjuntivoPreteritoImperfectoSe(this.replacements);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        super.setSubjuntivoFuturoImperfecto(this.replacements);
    }

    // Similar to the case of decir.Imp.Aff, the monos (there is just one, pon) and P, all drop their accents
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' || this.region === 'canarias') {
            this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/(.*)p[oó]ne/, (match: string, p1: string): string => {
                // if p1 ends with a space (tú pon: p1 ===  'tú ') - this is the mono we're looking for
                if (/\s+$/.test(p1) || this.type === 'P') return `${p1}pon`;
                return `${p1}pón`;   //  else p1 didn't end with a space (tú repon: p1 === 'tú re')
            });
        }
    }
}

export class querer extends temer {
    private replacement: string;
    private repl: string[];
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/ue/, 'uie');
        const r2 = this.stem.replace(/er$/, 'is');
        this.repl = Array.from('012345').map(() => r2);
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.PreteritoIndefinido = ['ise', 'isiste', 'iso', 'isimos', 'isisteis', 'isieron'];
        this.desinences.Indicativo.FuturoImperfecto = ['ré', 'rás', 'rá', 'remos', 'réis', 'rán'];
        this.desinences.Indicativo.CondicionalSimple = ['ría', 'rías', 'ría', 'ríamos', 'ríais', 'rían'];

    }

    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setIndicativoPreteritoIndefinido(): void {
        const p = this.stem.replace(/uer/, 'u');
        super.setIndicativoPreteritoIndefinido(Array.from('012345').map(() => p));
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPreteritoImperfectoRa(): void {
        super.setSubjuntivoPreteritoImperfectoRa(this.repl);
    }
    protected setSubjuntivoPreteritoImperfectoSe(): void {
        super.setSubjuntivoPreteritoImperfectoSe(this.repl);
    }
    protected setSubjuntivoFuturoImperfecto(): void {
        super.setSubjuntivoFuturoImperfecto(this.repl);
    }
}

export class raer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.map(g => g.replace(/i/, 'y'));
        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.map(g => g.replace(/i/, 'í'));
        if (this.version === '0') {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'ig'));
        } else {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'y');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'y'));
        }
        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
            this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
            this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}

export class responder extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/sp.*/, 'p');
    }

    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Indicativo.PreteritoIndefinido = ['use', 'usiste', 'uso', 'usimos', 'usisteis', 'usieron'];
    }

    protected setIndicativoPreteritoIndefinido(): void {
        super.setIndicativoPreteritoIndefinido(Array.from('012345').map(() => this.replacement));
    }
}
export class roer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.map(g => g.replace(/i/, 'y'));
        this.desinences.Impersonal.Participio = this.desinences.Impersonal.Participio.map(g => g.replace(/i/, 'í'));
        if (this.version === '1') {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'ig');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'ig'));
        } else if (this.version === '2') {
            this.desinences.Indicativo.Presente[0] = this.desinences.Indicativo.Presente[0].replace(/^/, 'y');
            this.desinences.Subjuntivo.Presente = this.desinences.Subjuntivo.Presente.map(d => d.replace(/^/, 'y'));
        }
        this.desinences.Indicativo.PreteritoIndefinido = ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'];
        this.desinences.Subjuntivo.PreteritoImperfectoRa = ['yera', 'yeras', 'yera', 'yéramos', 'yerais', 'yeran'],
            this.desinences.Subjuntivo.PreteritoImperfectoSe = ['yese', 'yeses', 'yese', 'yésemos', 'yeseis', 'yesen'],
            this.desinences.Subjuntivo.FuturoImperfecto = ['yere', 'yeres', 'yere', 'yéremos', 'yereis', 'yeren']
    }
}

export class tañer extends temer {
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
    }
    protected configDesinences(): void {
        super.configDesinences();
        this.desinences.Impersonal.Gerundio = this.desinences.Impersonal.Gerundio.map(d => d.replace(/^i/, ''));
        this.desinences.Indicativo.PreteritoIndefinido[2] = 'ó';
        this.desinences.Indicativo.PreteritoIndefinido[5] = 'eron';

        this.desinences.Subjuntivo.PreteritoImperfectoRa = this.desinences.Subjuntivo.PreteritoImperfectoRa.map(d => d.replace(/^i/, ''));
        this.desinences.Subjuntivo.PreteritoImperfectoSe = this.desinences.Subjuntivo.PreteritoImperfectoSe.map(d => d.replace(/^i/, ''));
        this.desinences.Subjuntivo.FuturoImperfecto = this.desinences.Subjuntivo.FuturoImperfecto.map(d => d.replace(/^i/, ''));
    }
}
export class tender extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/(.*)e/, '$1ie');
    }
    protected setIndicativoPresente(): void {
        this.setIndicativoPresentePattern_0125(this.replacement);
    }
    protected setSubjuntivoPresente(): void {
        this.setSubjuntivoPresentePattern_0125(this.replacement);
    }
}

export class vencer extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.replacement = this.stem.replace(/c$/, 'z');
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, ...Array.from('12345').map(() => this.stem)]);
    }

    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
}

export class yacer extends temer {
    private replacement: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        switch (this.version) {
            case '0':
                this.replacement = this.stem.replace(/c$/, 'zc');
                break;
            case '1':
                this.replacement = this.stem.replace(/c$/, 'g');
                break;
            case '2':
            default:
                this.replacement = this.stem.replace(/c$/, 'zg');
                break;
        }
    }
    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.replacement, ...Array.from('12345').map(() => this.stem)]);
    }
    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente(Array.from('012345').map(() => this.replacement));
    }
    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.version !== '0' && (this.region === 'canarias' || this.region === 'castellano')) {
            this.table.Imperativo.Afirmativo[1] = this.table.Imperativo.Afirmativo[1].replace(/ce$/, 'z');
        }
    }
}


