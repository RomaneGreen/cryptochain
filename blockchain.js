const Block = require('./block');
const cryptoHash = require('./crypto-hash')


class Blockchain {
constructor() {
    this.chain = [Block.genesis()]
}

addBlock({ data }) {
   const newBlock = Block.mineBlock({
       lastBlock: this.chain[this.chain.length - 1],
       data
   })

   this.chain.push(newBlock)
}

static isValidChain(chain) {


     if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))  return false;
    


    for (let i=0;i<chain.length;i++){

     const block = chain[i]

     const actualLastHash = chain[i-1].hash;

     const { timestamp, data, lastHash, hash} = block;

    }

    if (lastHash !== actualLastHash) return false;

    const validatedHash = cryptoHash(lastHash, timestamp, data)

    if( hash !== validatedHash)  return false;

    return true
}
}

module.exports = Blockchain;