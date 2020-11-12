/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek, jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering, Colorado LLC
 * @license * MIT License
*/
import { PronominalKey, Regions } from './types';
import { BaseModel, ModelAttributes } from './basemodel';
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

    public getModel(verb: string, modelName: string, type: PronominalKey, region: Regions, attributes: ModelAttributes): BaseModel | undefined {
        if (ar[modelName as ArKey]) {
            return new ar[modelName as ArKey](verb, type, region, attributes);
        } else if (er[modelName as ErKey]) {
            return new er[modelName as ErKey](verb, type, region, attributes);
        } else if (ir[modelName as IrKey]) {
            return new ir[modelName as IrKey](verb, type, region, attributes);
        }
        return undefined;
    }

    // Return base model stripped of attributes, used for doing a comparison to highlight
    public getSimulatedModel(verb: string, modelName: string, type: PronominalKey, region: Regions): BaseModel | undefined {
        if (ar[modelName as ArKey]) {
            return this.getModel(verb, 'hablar', type, region, {});
        } else if (er[modelName as ErKey]) {
            return this.getModel(verb, 'temer', type, region, {});
        } else if (ir[modelName as IrKey]) {
            return new ir[modelName as IrKey](verb, type, region, {});
        }
        return undefined;
    }

    public getModels(): string[] {
        const models: Set<string> = new Set(Object.keys(ar));
        Object.keys(er).forEach(m => models.add(m));
        Object.keys(ir).forEach(m => models.add(m));
        return Array.from(models);
    }
}



