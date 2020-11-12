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

    /**
     * Get verb appropriate model unless the sim flag is true
     * @param verb 
     * @param model 
     * @param type 
     * @param region 
     * @param attrs 
     * @param sim - simulate basemodel (regular) conjugation, return regular model
     */
    public getModel(verb: string, model: string, type: PronominalKey, region: Regions, attrs: ModelAttributes, sim = false): BaseModel | undefined {
        if (ar[model as ArKey]) {
            if (sim) {
                return new ar['hablar'](verb, type, region, {});
            }
            return new ar[model as ArKey](verb, type, region, attrs);
        } else if (er[model as ErKey]) {
            if (sim) {
                return new er['temer'](verb, type, region, {});
            }
            return new er[model as ErKey](verb, type, region, attrs);
        } else if (ir[model as IrKey]) {
            if (sim) {
                return new ir['partir'](verb, type, region, {});
            }
            return new ir[model as IrKey](verb, type, region, attrs);
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



