const Matrix = require('matrixmath/Matrix');

class AnaliticsMethod { 
    constructor(variant) {
        console.log('Решение аналитическим методом:');
        this.matrix = new Matrix(variant.length, variant[0].length).setData(AnaliticsMethod.toArray(variant));

        this.matrixU = new Matrix(1, this.matrix.cols).setData(AnaliticsMethod.eArray(this.matrix.cols));

        this.transpondMatrixU = this.matrixU.clone().transpose();

        this.invertedMatrix = this.matrix.clone().invert();
    }

    getX() {
        return Matrix.multiply(Matrix.multiply(this.invertedMatrix, this.transpondMatrixU),
            1 / (Matrix.multiply(this.matrixU, this.invertedMatrix, this.transpondMatrixU).toArray()))
            .toArray()
            .map((element) => {
                return Math.round(element * 10000) / 10000;
            });
    }

    getY() {
        return Matrix.multiply(Matrix.multiply(this.matrixU, this.invertedMatrix),
            1 / (Matrix.multiply(this.matrixU, this.invertedMatrix, this.transpondMatrixU).toArray()))
            .toArray()
            .map((element) => {
                return Math.round(element * 1000) / 1000;
            });
    }

    getGameCost() {
        return Math.round((1 / (Matrix.multiply(this.matrixU, this.invertedMatrix, this.transpondMatrixU).toArray())) * 1000) / 1000;
    }

    showGameResults() {
        console.log(`X* = ${this.getX()}`);
        console.log(`Y* = ${this.getY()}`);
        console.log(`Цена игры аналитическим методом: ${this.getGameCost()}\n`);
    }

    static eArray(length) {
        let newArray = [];
        for (let index = 0; index < length; index++) {
            newArray.push(1);
        }

        return newArray;
    }

    static toArray(doubleArray) {
        let longArray = [];
        doubleArray.forEach(element => {
            longArray.push(...element);
        });

        return longArray;
    }
}

module.exports.AnaliticsMethod = AnaliticsMethod;