/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { BaseModel } from './basemodel';
import { clearAccents } from './utilities/stringutils';
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { ER } from './declarations/constants';

export class temer extends BaseModel {

    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(ER));
        this.configDesinences();
        this.setDesinencesByRegion();
    }

    protected configDesinences(): void {
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'és';
        }
    }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' && this.type !== 'N') {
            // This is the only line that's different between AR ER IR.  So far. 3/18/20
            this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));   // NOTE: ar == er != ir
        }
    }
}

export class nacer extends temer {
    private newStem: string;
    public constructor(verb: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(verb, type, region, attributes);
        this.newStem = this.stem.replace(/s?c$/, 'zc');
    }

    protected setIndicativoPresente(): void {
        super.setIndicativoPresente([this.newStem, this.stem, this.stem, this.stem, this.stem, this.stem]);
    }

    protected setSubjuntivoPresente(): void {
        super.setSubjuntivoPresente([this.newStem, this.newStem, this.newStem, this.newStem, this.newStem, this.newStem]);
    }
}


