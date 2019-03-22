const { GENESIS_DATA } = require('./config')
const cryptoHash = require('./crypto-hash')

class Block {
    constructor({timestamp, lastHash, hash, data,genesis}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        
        }
        static genesis () {
            return new this(GENESIS_DATA);
    }

     static mineBlock({lastBlock, data}) {
             const timestamp = Date.now()
             const lastHash = lastBlock.hash

                return new this({
                timestamp,
                lastHash,
                data,
                hash: cryptoHash(timestamp,lastHash, data)
                })
         }
        }
const  block1 = new Block({
    hash:'foo-lastHash',
    lastHash:'foo-hash',
    timestamp:'01/01/01',
    data:'foo-data'
})

console.log(block1)

module.exports = Block;