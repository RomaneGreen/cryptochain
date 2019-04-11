const Block = require('./block')
const { GENESIS_DATA,MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')

describe('Block',() => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain','data'];
    const nonce = 1;
    const dificulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data})

    it('has timestamp hash lasthash and data property',() => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    })


    describe('genesis()', () => {
        const genesisBlock = Block.genesis();


        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);

        })
        it('returns genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
            
        })
        describe('mimeBlock()', () => {
            const lastBlock = Block.genesis();
            const data = 'mined data';
            const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true)
        })
        it('sets the lastHash to be the hash of the last block', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        })
        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data)
        })
        it('sets a timestamp',() => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })
        it('sets a `hash` that matches difficulty crieteria',() =>{
            expect(minedBlock.hash.substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })
        it('creates a sha256 hash based on proper inputs',() => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp,
                lastBlock.hash,
                mineBlock.nonce,
                minedBlock.difficulty,
                data
            ))
        })
    })
})
})