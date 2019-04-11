const { GENESIS_DATA, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')

class Block {
    constructor({timestamp, lastHash, hash, data, genesis,nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty
        
        }
        static genesis () {
            return new this(GENESIS_DATA);
    }

     static mineBlock({ lastBlock, data }) {

            let hash,timestamp;
             const lastHash = lastBlock.hash
             const { difficulty } = lastBlock;
             let nonce = 0;
            do {
                nonce++
                timestamp = Date.now()
                hash = cryptoHash(timestamp,lastHash,data,nonce,difficulty)
            } while (hash.substring(0,difficulty) !== '0'.repeat(difficulty))
                return new this({ 
                    timestamp,
                    lastHash,
                    difficulty,
                    nonce,
                    hash })
                    // cryptoHash(timestamp, lastHash, data, nonce, difficulty) })
         }

         static adjustDifficulty ({ originalBlock, timestamp}) {

            const {difficulty} = originalBlock;

            if (timestamp - originalBlock.timestamp > MINE_RATE ) return difficulty - 1;
            return difficulty + 1;
         }
        }

    
// const  block1 = new Block({
//     hash:'foo-lastHash',
//     lastHash:'foo-hash',
//     timestamp:'01/01/01',
//     data:'foo-data'
// })

// console.log(block1)

module.exports = Block;