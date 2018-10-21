const fs = require('fs');

class BraunRobinson {
    constructor(initialValues) {
        this.gameMatrix = initialValues.slice()
            .map((element) => (element.slice()));
        this.iteration = 1;
        this.stratagyA = 0;
        this.stratagyB = 0;

        this.failVectorB = this.gameMatrix[this.stratagyA];
        this.successVectorA = this.gameMatrix.reduce((sum, current) => {
            sum.push(current[this.stratagyB]);
            return sum;
        }, []);

        this.loverCost = Math.max(...this.successVectorA);

        this.upperCost = Math.min(...this.failVectorB);

        // this.minLoverCost = this.loverCost;
        // this.maxUpperCost = this.upperCost;

        this.loverCostsVector = [this.loverCost];
        this.upperCostsVector = [this.upperCost];

        this.epsilon = this.loverCost - this.upperCost;

        this.stratagyWeightA = this.gameMatrix.map(element => 0);
        this.stratagyWeightA[this.stratagyA]++;

        this.stratagyWeightB = this.gameMatrix[0].map(element => 0);
        this.stratagyWeightB[this.stratagyB]++;
    }

    writefile() {
        if (this.iteration == 1) {
            console.log('Решение методом Брауна-Робинсона:')
            fs.writeFile("BraunRobinsonIterations.txt", "Начало\n", function (error) {
                if (error) throw error;
            });
            //fs.appendFileSync("BraunRobinsonIterations.txt", 'brrr');
            //fs.appendFileSync("BraunRobinsonIterations.txt", '12345667899');
            //fs.appendFileSync("BraunRobinsonIterations.txt", 'Итерация');
        } 
        //fs.appendFileSync("BraunRobinsonIterations.txt", `Итерация  ${this.iteration}; Стратегия А  -  ${1 + this.stratagyA}; Стратегия B  -  ${1 + this.stratagyB}; Вектор побед ${this.successVectorA}; Вектор поражений ${this.failVectorB}; Нижняя цена игры - ${this.round(this.loverCost, 5)}; Верхняя цена игры - ${this.round(this.upperCost, 5)}; E равно ${this.round(this.epsilon, 5)}\n`);
        
        fs.appendFileSync("BraunRobinsonIterations.txt", `${this.iteration};${1 + this.stratagyA};${1 + this.stratagyB};${this.successVectorA};${this.failVectorB};${this.round(this.loverCost, 5)};${this.round(this.upperCost, 5)};${this.round(this.epsilon, 5)}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt", `Итерация  ${this.iteration}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt",  `Стратегия А  -  ${1 + this.stratagyA}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt",  `Стратегия B  -  ${1 + this.stratagyB}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt", `Нижняя цена игры - ${this.round(this.loverCost, 5)}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt", `Верхняя цена игры - ${this.round(this.upperCost, 5)}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt", `E равно ${this.round(Math.min(...this.loverCostsVector), 5)} - ${this.round(Math.max(...this.upperCostsVector), 5)} = ${this.round(this.epsilon, 5)}\n`);
        // fs.appendFileSync("BraunRobinsonIterations.txt", '\n');

    }

    showCurrentStatistics() {
        this.writefile();
        // console.log("Итерация " + this.iteration);
        // console.log(`Стратегия А  -  ${1 + this.stratagyA}`);
        // console.log(`Стратегия B  -  ${1 + this.stratagyB}`);
        // console.log(`Нижняя цена игры - ${this.round(this.loverCost, 5)}`);
        // console.log(`Верхняя цена игры - ${this.round(this.upperCost, 5)}`);
        // console.log(`E равно ${this.round(Math.min(...this.loverCostsVector), 5)} - ${this.round(Math.max(...this.upperCostsVector), 5)} = ${this.round(this.epsilon, 5)}`);
        // console.log('');
    }

    round(number, k) {
        return Math.round(number * Math.pow(10, k)) / Math.pow(10, k);
    }

    showAlgoritmResult() {
        console.log(`Цена игры: ${this.round((this.loverCost + this.upperCost) / 2, 5)}`);

        console.log(`Вектор стратегий игрока A:`);
        this.stratagyWeightA.forEach(element => {
            console.log(`${element} / ${this.iteration}`);
        });

        console.log(`Вектор стратегий игрока B:`);
        this.stratagyWeightB.forEach(element => {
            console.log(`${element} / ${this.iteration}`);
        });

        const a = this.stratagyWeightA.reduce((sum, element) => {
            return sum += element;
        });

        const b = this.stratagyWeightB.reduce((sum, element) => {
            return sum += element;
        });

        if ((a == this.iteration) && (b == this.iteration)) {
            console.log('Проверка выполнена!');
        } else {
            console.log('Проверка не выполнена!');
        }
        console.log('');
    }

    startGameConsole() {
        this.showCurrentStatistics();

        while (this.epsilon > 0.01) {
            this.iteration++;

            // новая стратегия игрока А
            this.stratagyA = this.successVectorA.reduce((stratagy, current, idx) => {
                if (current > this.successVectorA[stratagy]) {
                    return idx;
                }

                return stratagy;
            }, Math.floor(Math.random() * this.successVectorA.length));

            // новая стратегия игрока B
            this.stratagyB = this.failVectorB.reduce((stratagy, current, idx) => {
                if (current < this.failVectorB[stratagy]) {
                    return idx;
                }

                return stratagy;
            }, Math.floor(Math.random() * this.failVectorB.length));

            // новые значения векторов победы и проигрыша при выбранных стратегиях для А и Б
            this.failVectorB = this.failVectorB.map((element, idx) => element + this.gameMatrix[this.stratagyA][idx]);

            const currentSuccessVectorToAdd = this.gameMatrix.reduce((sum, current) => {
                sum.push(current[this.stratagyB]);
                return sum;
            }, []);
            this.successVectorA = this.successVectorA.map((element, idx) => element + currentSuccessVectorToAdd[idx]);

            // новые нижняя и верхняя границы
            this.loverCost = Math.max(...this.successVectorA) / this.iteration;
            this.upperCost = Math.min(...this.failVectorB) / this.iteration;

            // this.minLoverCost = (this.loverCost <= this.minLoverCost) ? this.loverCost : this.minLoverCost;
            // this.maxUpperCost = (this.upperCost >= this.maxUpperCost) ? this.upperCost : this.loverCost;
            // this.epsilon = this.minLoverCost - this.maxUpperCost;
            
            // сохраняем текущие нижнюю и верхнюю оценки
            this.loverCostsVector.push(this.loverCost);
            this.upperCostsVector.push(this.upperCost);
            this.epsilon = Math.min(...this.loverCostsVector) - Math.max(...this.upperCostsVector);


            // пересчитываем веса стратегий
            this.stratagyWeightA[this.stratagyA]++;
            this.stratagyWeightB[this.stratagyB]++;

            this.showCurrentStatistics();
        }

        this.showAlgoritmResult();
    }

}

module.exports = BraunRobinson;