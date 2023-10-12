const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [new Block()];
    }
    addBlock(data) {
        data.previousHash = this.chain[this.chain.length - 1].toHash()
        this.chain.push(data);
    }
    isValid() {
        for(let i = this.chain.length - 1; i > 0; i--) {
            const block = this.chain[i];
            const prev = this.chain[i - 1];
            if(block.previousHash.toString() !== prev.toHash().toString()) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;