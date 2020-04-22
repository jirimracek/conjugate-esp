/**
 * @copyright 
 * Copyright (c) 2020 Jiri Mracek jiri@automationce.com 
 * Copyright (c) 2020 Automation Controls & Engineering
 * @license * MIT License
*/

import { text2Json, json2Text } from '../utilities/modelutils'

// Conversion test by hand
const abandonarJson = {
    'Impersonal': { 'Infinitivo': ['abandonar'], 'Gerundio': ['abandonando'], 'Participio': ['abandonado'] },
    'Indicativo': {
        'Presente': ['yo abandono', 'tú abandonas', 'él abandona', 'nosotros abandonamos', 'ustedes abandonan', 'ellos abandonan'],
        'PreteritoImperfecto': ['yo abandonaba', 'tú abandonabas', 'él abandonaba', 'nosotros abandonábamos', 'ustedes abandonaban', 'ellos abandonaban'],
        'PreteritoIndefinido': ['yo abandoné', 'tú abandonaste', 'él abandonó', 'nosotros abandonamos', 'ustedes abandonaron', 'ellos abandonaron'],
        'FuturoImperfecto': ['yo abandonaré', 'tú abandonarás', 'él abandonará', 'nosotros abandonaremos', 'ustedes abandonarán', 'ellos abandonarán'],
        'CondicionalSimple': ['yo abandonaría', 'tú abandonarías', 'él abandonaría', 'nosotros abandonaríamos', 'ustedes abandonarían', 'ellos abandonarían'],
        'PreteritoPerfecto': ['yo he abandonado', 'tú has abandonado', 'él ha abandonado', 'nosotros hemos abandonado', 'ustedes han abandonado', 'ellos han abandonado'],
        'PreteritoPluscuamperfecto': ['yo había abandonado', 'tú habías abandonado', 'él había abandonado', 'nosotros habíamos abandonado', 'ustedes habían abandonado', 'ellos habían abandonado'],
        'PreteritoAnterior': ['yo hube abandonado', 'tú hubiste abandonado', 'él hubo abandonado', 'nosotros hubimos abandonado', 'ustedes hubieron abandonado', 'ellos hubieron abandonado'],
        'FuturoPerfecto': ['yo habré abandonado', 'tú habrás abandonado', 'él habrá abandonado', 'nosotros habremos abandonado', 'ustedes habrán abandonado', 'ellos habrán abandonado'],
        'CondicionalCompuesto': ['yo habría abandonado', 'tú habrías abandonado', 'él habría abandonado', 'nosotros habríamos abandonado', 'ustedes habrían abandonado', 'ellos habrían abandonado']
    },
    'Subjuntivo': {
        'Presente': ['yo abandone', 'tú abandones', 'él abandone', 'nosotros abandonemos', 'ustedes abandonen', 'ellos abandonen'],
        'PreteritoImperfectoRa': ['yo abandonara', 'tú abandonaras', 'él abandonara', 'nosotros abandonáramos', 'ustedes abandonaran', 'ellos abandonaran'],
        'PreteritoImperfectoSe': ['yo abandonase', 'tú abandonases', 'él abandonase', 'nosotros abandonásemos', 'ustedes abandonasen', 'ellos abandonasen'],
        'FuturoImperfecto': ['yo abandonare', 'tú abandonares', 'él abandonare', 'nosotros abandonáremos', 'ustedes abandonaren', 'ellos abandonaren'],
        'PreteritoPerfecto': ['yo haya abandonado', 'tú hayas abandonado', 'él haya abandonado', 'nosotros hayamos abandonado', 'ustedes hayan abandonado', 'ellos hayan abandonado'],
        'PreteritoPluscuamperfectoRa': ['yo hubiera abandonado', 'tú hubieras abandonado', 'él hubiera abandonado', 'nosotros hubiéramos abandonado', 'ustedes hubieran abandonado', 'ellos hubieran abandonado'],
        'PreteritoPluscuamperfectoSe': ['yo hubiese abandonado', 'tú hubieses abandonado', 'él hubiese abandonado', 'nosotros hubiésemos abandonado', 'ustedes hubiesen abandonado', 'ellos hubiesen abandonado'],
        'FuturoPerfecto': ['yo hubiere abandonado', 'tú hubieres abandonado', 'él hubiere abandonado', 'nosotros hubiéremos abandonado', 'ustedes hubieren abandonado', 'ellos hubieren abandonado']
    },
    'Imperativo': {
        'Afirmativo': ['-', 'tú abandona', '-', 'nosotros abandonemos', 'ustedes abandonen', '-'],
        'Negativo': ['-', 'tú no abandones', '-', 'nosotros no abandonemos', 'ustedes no abandonen', '-']
    }
};
const abandonarText = ['abandonar', 'abandonando', 'abandonado',
    'yo abandono', 'tú abandonas', 'él abandona', 'nosotros abandonamos', 'ustedes abandonan', 'ellos abandonan',
    'yo abandonaba', 'tú abandonabas', 'él abandonaba', 'nosotros abandonábamos', 'ustedes abandonaban', 'ellos abandonaban',
    'yo abandoné', 'tú abandonaste', 'él abandonó', 'nosotros abandonamos', 'ustedes abandonaron', 'ellos abandonaron',
    'yo abandonaré', 'tú abandonarás', 'él abandonará', 'nosotros abandonaremos', 'ustedes abandonarán', 'ellos abandonarán',
    'yo abandonaría', 'tú abandonarías', 'él abandonaría', 'nosotros abandonaríamos', 'ustedes abandonarían', 'ellos abandonarían',
    'yo he abandonado', 'tú has abandonado', 'él ha abandonado', 'nosotros hemos abandonado', 'ustedes han abandonado', 'ellos han abandonado',
    'yo había abandonado', 'tú habías abandonado', 'él había abandonado', 'nosotros habíamos abandonado', 'ustedes habían abandonado', 'ellos habían abandonado',
    'yo hube abandonado', 'tú hubiste abandonado', 'él hubo abandonado', 'nosotros hubimos abandonado', 'ustedes hubieron abandonado', 'ellos hubieron abandonado',
    'yo habré abandonado', 'tú habrás abandonado', 'él habrá abandonado', 'nosotros habremos abandonado', 'ustedes habrán abandonado', 'ellos habrán abandonado',
    'yo habría abandonado', 'tú habrías abandonado', 'él habría abandonado', 'nosotros habríamos abandonado', 'ustedes habrían abandonado', 'ellos habrían abandonado',
    'yo abandone', 'tú abandones', 'él abandone', 'nosotros abandonemos', 'ustedes abandonen', 'ellos abandonen',
    'yo abandonara', 'tú abandonaras', 'él abandonara', 'nosotros abandonáramos', 'ustedes abandonaran', 'ellos abandonaran',
    'yo abandonase', 'tú abandonases', 'él abandonase', 'nosotros abandonásemos', 'ustedes abandonasen', 'ellos abandonasen',
    'yo abandonare', 'tú abandonares', 'él abandonare', 'nosotros abandonáremos', 'ustedes abandonaren', 'ellos abandonaren',
    'yo haya abandonado', 'tú hayas abandonado', 'él haya abandonado', 'nosotros hayamos abandonado', 'ustedes hayan abandonado', 'ellos hayan abandonado',
    'yo hubiera abandonado', 'tú hubieras abandonado', 'él hubiera abandonado', 'nosotros hubiéramos abandonado', 'ustedes hubieran abandonado', 'ellos hubieran abandonado',
    'yo hubiese abandonado', 'tú hubieses abandonado', 'él hubiese abandonado', 'nosotros hubiésemos abandonado', 'ustedes hubiesen abandonado', 'ellos hubiesen abandonado',
    'yo hubiere abandonado', 'tú hubieres abandonado', 'él hubiere abandonado', 'nosotros hubiéremos abandonado', 'ustedes hubieren abandonado', 'ellos hubieren abandonado',
    '-', 'tú abandona', '-', 'nosotros abandonemos', 'ustedes abandonen', '-', '-', 'tú no abandones', '-', 'nosotros no abandonemos', 'ustedes no abandonen', '-'];
const abandonarseJson = {
    'Impersonal': { 'Infinitivo': ['abandonarse'], 'Gerundio': ['abandonándose'], 'Participio': ['abandonado'] },
    'Indicativo': {
        'Presente': ['yo me abandono', 'tú te abandonas', 'él se abandona', 'nosotros nos abandonamos', 'ustedes se abandonan', 'ellos se abandonan'],
        'PreteritoImperfecto': ['yo me abandonaba', 'tú te abandonabas', 'él se abandonaba', 'nosotros nos abandonábamos', 'ustedes se abandonaban', 'ellos se abandonaban'],
        'PreteritoIndefinido': ['yo me abandoné', 'tú te abandonaste', 'él se abandonó', 'nosotros nos abandonamos', 'ustedes se abandonaron', 'ellos se abandonaron'],
        'FuturoImperfecto': ['yo me abandonaré', 'tú te abandonarás', 'él se abandonará', 'nosotros nos abandonaremos', 'ustedes se abandonarán', 'ellos se abandonarán'],
        'CondicionalSimple': ['yo me abandonaría', 'tú te abandonarías', 'él se abandonaría', 'nosotros nos abandonaríamos', 'ustedes se abandonarían', 'ellos se abandonarían'],
        'PreteritoPerfecto': ['yo me he abandonado', 'tú te has abandonado', 'él se ha abandonado', 'nosotros nos hemos abandonado', 'ustedes se han abandonado', 'ellos se han abandonado'],
        'PreteritoPluscuamperfecto': ['yo me había abandonado', 'tú te habías abandonado', 'él se había abandonado', 'nosotros nos habíamos abandonado', 'ustedes se habían abandonado', 'ellos se habían abandonado'],
        'PreteritoAnterior': ['yo me hube abandonado', 'tú te hubiste abandonado', 'él se hubo abandonado', 'nosotros nos hubimos abandonado', 'ustedes se hubieron abandonado', 'ellos se hubieron abandonado'],
        'FuturoPerfecto': ['yo me habré abandonado', 'tú te habrás abandonado', 'él se habrá abandonado', 'nosotros nos habremos abandonado', 'ustedes se habrán abandonado', 'ellos se habrán abandonado'],
        'CondicionalCompuesto': ['yo me habría abandonado', 'tú te habrías abandonado', 'él se habría abandonado', 'nosotros nos habríamos abandonado', 'ustedes se habrían abandonado', 'ellos se habrían abandonado']
    },
    'Subjuntivo': {
        'Presente': ['yo me abandone', 'tú te abandones', 'él se abandone', 'nosotros nos abandonemos', 'ustedes se abandonen', 'ellos se abandonen'],
        'PreteritoImperfectoRa': ['yo me abandonara', 'tú te abandonaras', 'él se abandonara', 'nosotros nos abandonáramos', 'ustedes se abandonaran', 'ellos se abandonaran'],
        'PreteritoImperfectoSe': ['yo me abandonase', 'tú te abandonases', 'él se abandonase', 'nosotros nos abandonásemos', 'ustedes se abandonasen', 'ellos se abandonasen'],
        'FuturoImperfecto': ['yo me abandonare', 'tú te abandonares', 'él se abandonare', 'nosotros nos abandonáremos', 'ustedes se abandonaren', 'ellos se abandonaren'],
        'PreteritoPerfecto': ['yo me haya abandonado', 'tú te hayas abandonado', 'él se haya abandonado', 'nosotros nos hayamos abandonado', 'ustedes se hayan abandonado', 'ellos se hayan abandonado'],
        'PreteritoPluscuamperfectoRa': ['yo me hubiera abandonado', 'tú te hubieras abandonado', 'él se hubiera abandonado', 'nosotros nos hubiéramos abandonado', 'ustedes se hubieran abandonado', 'ellos se hubieran abandonado'],
        'PreteritoPluscuamperfectoSe': ['yo me hubiese abandonado', 'tú te hubieses abandonado', 'él se hubiese abandonado', 'nosotros nos hubiésemos abandonado', 'ustedes se hubiesen abandonado', 'ellos se hubiesen abandonado'],
        'FuturoPerfecto': ['yo me hubiere abandonado', 'tú te hubieres abandonado', 'él se hubiere abandonado', 'nosotros nos hubiéremos abandonado', 'ustedes se hubieren abandonado', 'ellos se hubieren abandonado']
    },
    'Imperativo': {
        'Afirmativo': ['-', 'tú abandónate', '-', 'nosotros abandonémonos', 'ustedes abandónense', '-'],
        'Negativo': ['-', 'tú no te abandones', '-', 'nosotros no nos abandonemos', 'ustedes no se abandonen', '-']
    }
}
const abandonarseText = ['abandonarse', 'abandonándose', 'abandonado',
    'yo me abandono', 'tú te abandonas', 'él se abandona', 'nosotros nos abandonamos', 'ustedes se abandonan', 'ellos se abandonan',
    'yo me abandonaba', 'tú te abandonabas', 'él se abandonaba', 'nosotros nos abandonábamos', 'ustedes se abandonaban', 'ellos se abandonaban',
    'yo me abandoné', 'tú te abandonaste', 'él se abandonó', 'nosotros nos abandonamos', 'ustedes se abandonaron', 'ellos se abandonaron',
    'yo me abandonaré', 'tú te abandonarás', 'él se abandonará', 'nosotros nos abandonaremos', 'ustedes se abandonarán', 'ellos se abandonarán',
    'yo me abandonaría', 'tú te abandonarías', 'él se abandonaría', 'nosotros nos abandonaríamos', 'ustedes se abandonarían', 'ellos se abandonarían',
    'yo me he abandonado', 'tú te has abandonado', 'él se ha abandonado', 'nosotros nos hemos abandonado', 'ustedes se han abandonado', 'ellos se han abandonado',
    'yo me había abandonado', 'tú te habías abandonado', 'él se había abandonado', 'nosotros nos habíamos abandonado', 'ustedes se habían abandonado', 'ellos se habían abandonado',
    'yo me hube abandonado', 'tú te hubiste abandonado', 'él se hubo abandonado', 'nosotros nos hubimos abandonado', 'ustedes se hubieron abandonado', 'ellos se hubieron abandonado',
    'yo me habré abandonado', 'tú te habrás abandonado', 'él se habrá abandonado', 'nosotros nos habremos abandonado', 'ustedes se habrán abandonado', 'ellos se habrán abandonado',
    'yo me habría abandonado', 'tú te habrías abandonado', 'él se habría abandonado', 'nosotros nos habríamos abandonado', 'ustedes se habrían abandonado', 'ellos se habrían abandonado',
    'yo me abandone', 'tú te abandones', 'él se abandone', 'nosotros nos abandonemos', 'ustedes se abandonen', 'ellos se abandonen',
    'yo me abandonara', 'tú te abandonaras', 'él se abandonara', 'nosotros nos abandonáramos', 'ustedes se abandonaran', 'ellos se abandonaran',
    'yo me abandonase', 'tú te abandonases', 'él se abandonase', 'nosotros nos abandonásemos', 'ustedes se abandonasen', 'ellos se abandonasen',
    'yo me abandonare', 'tú te abandonares', 'él se abandonare', 'nosotros nos abandonáremos', 'ustedes se abandonaren', 'ellos se abandonaren',
    'yo me haya abandonado', 'tú te hayas abandonado', 'él se haya abandonado', 'nosotros nos hayamos abandonado', 'ustedes se hayan abandonado', 'ellos se hayan abandonado',
    'yo me hubiera abandonado', 'tú te hubieras abandonado', 'él se hubiera abandonado', 'nosotros nos hubiéramos abandonado', 'ustedes se hubieran abandonado', 'ellos se hubieran abandonado',
    'yo me hubiese abandonado', 'tú te hubieses abandonado', 'él se hubiese abandonado', 'nosotros nos hubiésemos abandonado', 'ustedes se hubiesen abandonado', 'ellos se hubiesen abandonado',
    'yo me hubiere abandonado', 'tú te hubieres abandonado', 'él se hubiere abandonado', 'nosotros nos hubiéremos abandonado', 'ustedes se hubieren abandonado', 'ellos se hubieren abandonado',
    '-', 'tú abandónate', '-', 'nosotros abandonémonos', 'ustedes abandónense', '-', '-', 'tú no te abandones', '-', 'nosotros no nos abandonemos', 'ustedes no se abandonen', '-'];

describe('Model Utils', () => {
    test('text2Json()', () => {
        expect(text2Json(abandonarText)).toEqual(abandonarJson);
        expect(text2Json(abandonarseText)).toEqual(abandonarseJson);
    });

    test('json2Text()', () => {
        expect(json2Text(abandonarJson)).toEqual(abandonarText);
        expect(json2Text(abandonarseJson)).toEqual(abandonarseText);
    });

});