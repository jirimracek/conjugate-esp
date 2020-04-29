/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
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
    constructor() {
        // empty
    }

    public getModel(verb: string, modelName: string, type: PronominalKeys, region: Regions, attributes: ModelAttributes): BaseModel {
        if (ar[modelName as ArKey]) {
            return new ar[modelName as ArKey](verb, type, region, attributes);
        } else if (er[modelName as ErKey]) {
            return new er[modelName as ErKey](verb, type, region, attributes);
        } else if (ir[modelName as IrKey]) {
            return new ir[modelName as IrKey](verb, type, region, attributes);
        }
        return new Empty(verb, type, region, attributes);
    }

    /**
     * Development helper
     * @param model 
     */
    public isImplemented(name: string): boolean {
        return !!(ar[name as ArKey] || er[name as ErKey] || ir[name as IrKey]);
    }
}



