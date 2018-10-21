'use strict';

const fs = require('fs');
const BraunRobinson = require('./BraunRobinson.js');
const AnaliticsMethod = require('./AnaliticsMethod').AnaliticsMethod;

const fileVariant = fs.readFileSync('variant.json', 'utf-8');
const variant = JSON.parse(fileVariant).matrix;
const testVariant = [
    [2, 1, 3],
    [3, 0, 1],
    [1, 2, 1]
];

const br = new BraunRobinson(testVariant);
// br.startGameConsole();

const an = new AnaliticsMethod(testVariant);
an.showGameResults();


