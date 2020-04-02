/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/
import { PronominalKeys, Regions, ModelAttributes } from './declarations/types';
import { BaseModel, Empty } from './basemodel';
import * as ar from './armodels';
import * as er from './ermodels';
import * as ir from './irmodels';

type ArKey = keyof typeof ar;
type ErKey = keyof typeof er;
type IrKey = keyof typeof ir;

export class ModelFactory {
    constructor() { };

    public getModel(name: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes): BaseModel {
        if (ar[name as ArKey]) {
            return new ar[name as ArKey](type, region, attributes);
        } else if (er[name as ErKey]) {
            return new er[name as ErKey](type, region, attributes);
        } else if (ir[name as IrKey]) {
            return new ir[name as IrKey](type, region, attributes);
        }
        return new Empty(type, region, attributes);
    }

    /**
     * Development helper
     * @param model 
     */
    public isImplemented(name: string): boolean {
        return !!(ar[name as ArKey] || er[name as ErKey] || ir[name as IrKey]);
    }
}



