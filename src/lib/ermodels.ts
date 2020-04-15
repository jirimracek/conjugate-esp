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

    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
        this.desinences = JSON.parse(JSON.stringify(ER));
        // Adjust voseo, 2nd singular
        if (this.region === 'voseo') {
            this.desinences.Indicativo.Presente[1] = 'és';
        }
        this.localTermConfig();
        this.configDesinencesByRegion();
    }

    protected localTermConfig(): void { }

    protected setImperativoAfirmativo(): void {
        super.setImperativoAfirmativo();
        if (this.region === 'castellano' && this.type !== 'N') {
            // This is the only line that's different between AR ER IR.  So far. 3/18/20
            this.table.Imperativo.Afirmativo[4] = clearAccents(this.table.Indicativo.Presente[4].replace(/^(.+?) (.*) (.*)is$/, '$1 $3$2'));   // NOTE: ar == er != ir
        }
    }

}

export class nacer extends temer {
    public constructor(type: PronominalKeys, region: Regions, attributes: ModelAttributes) {
        super(type, region, attributes);
    }

    protected beforeImperatives():void {
        const pattern: RegExp = /(.*)c(.*)/;
        const replacement: string = '$1zc$2';
        if (this.region === 'castellano') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }
        if (this.region === 'voseo') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }
        if (this.region === 'canarias' || this.region === 'formal') {
            this.replaceIndicativoPresente([0], pattern, replacement);
            this.replaceSubjuntivoPresente([0, 1, 2, 3, 4, 5], pattern, replacement);
        }

    }
}


