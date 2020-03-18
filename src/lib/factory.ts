/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { RegionType, V2M_PronType, V2M_AttrType, ModelInterface, TableType, FormatType } from './interfaces';
import * as ar from './ar';
import * as er from './er';
import * as ir from './ir';
import { Model } from './model';

export class Factory {
    constructor() { };
    public getModel(name: string, alias: string, type: V2M_PronType, region: RegionType, attributes: V2M_AttrType): Model {
        switch (name) {
            case 'amar': return new ar.Amar(alias, type, region, attributes);
            case 'temer': return new er.Temer(alias, type, region, attributes);
            case 'vivir': return new ir.Vivir(alias, type, region, attributes);
            default: 
            console.error(`Model ${name} not implemented`);
            return new Empty(alias, type, region, attributes);
        }
    }
}

class Empty extends Model implements ModelInterface {
    public constructor(alias: string, type: V2M_PronType, region: RegionType, attributes: V2M_AttrType) {
        super(alias, type, region, attributes);
    }

    public getConjugationOf(verb: string, format: FormatType): TableType | string[] {
        const status = <TableType>{ Status: { Model: ['not implemented']}};
        if (format === 'text') {
            return [`${JSON.stringify(status)}`];
        }
        return status;
    }
}



