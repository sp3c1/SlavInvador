'use strict';


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

class BruteBart {
    constructor(min, max, dict) {
        this.min = min;
        this.max = max;

        this.curLenght = min;
        this.vector = Array(min).fill(0);

        try {
            this.dict = dict.split("").filter(onlyUnique);
        } catch (e) {
            this.dict = dict;
        }

        this.maxDic = dict.length - 1;

    }

    showInernals() {
        console.log("Vector ", this.vector);
        console.log("Dict ", this.dict);
        console.log("MaxDic ", this.maxDic, "(+1)");
        console.log("Dict range", this.min, this.max);

        console.log('Current ', this.currentWord());
    }

    currentWord() {
        let word = '';
        for (let single of this.vector) {
            word += this.dict[single];
        }

        return word;
    }

    next() {
        let propagation = 1;


        for (let i = 0; i < this.curLenght; i++) {

            if (propagation) {
                this.vector[i]++;
                propagation = 0;
            }

            if (this.vector[i] > this.maxDic) {
                this.vector[i] = 0;
                propagation = 1;
            }

        }

        if (propagation) {
            if (this.vector.length == this.max) {
                throw new Error('Reached end of dictionary')
            }

            this.vector.push(0);
            console.log('expanding vector [ ' + (this.vector.length - 1) + ' -> ' + this.vector.length + ' ]');
        }
    }

    nextWord() {
        this.next();
        return this.currentWord();
    }

}


var dickGenerator = new BruteBart(1, 2, "a");


const cp = require('child_process');

class SlavsMaster {
    constructor(maxSlavs, generator) {
        this.maxSlavs = maxSlavs;
        this.generator = generator;
        this.cp = Array(maxSlavs);
        this.go();
    }

    attach(index) {
        this.cp[index] = cp.fork('./chp.js');
        let msg = this.generator.nextWord();
        console.log('check ', msg);

        this.cp[index].send(msg);

        this.cp[index].on('message', (m) => {
            console.log("======================================================")
            console.log('MESSAGE: ' + m);
            console.log("======================================================")
            process.exit(0);
            return; // got it!
        });

        this.cp[index].on('exit', (m) => {
            this.attach(index);
        });

        this.cp[index].on('err', (m) => {
            this.attach(index);
        });
    }

    go() {
        for (let i = 0; i < this.maxSlavs; i++) {
            this.attach(i);
        }
    }
}

let bruting = new SlavsMaster(1, dickGenerator);