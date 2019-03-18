const Blockchain = require('./blockchain')
const Block = require('./block')

describe('Blockchain', () => {


  beforeEach(() => {
   let blockchain = new Blockchain();
  })
  it('contains a `chain array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  })

  it('starts with genesis block', () => {
      expect(blockchain.chain[0]).toEqual(Block.genesis())
})

it('can add a block to chain', () => {
      const newData = 'foo bar'
      blockchain.addBlock({ data: newData })

      expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
})

  describe('isValidChain()',() => {
      describe('when the chain does not start with genesis block', () => {
        it('returns false',() => {
            blockchain.chain[0] = {data: 'fake-genesis'};
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })
    describe('chain starts with genesis block and has multiple blocks',() => {

      beforeEach(() => {
        blockchain.addBlock({ data: 'bears'})
            blockchain.addBlock({ data: 'beets'})
            blockchain.addBlock({ data: 'battlstar'})
      })
        describe('and lasthash refrence has changed', () => {
          it('returns false',() => {
           
            expect(Blockchain.isValidchain(blockchain.chain)).toBe(false)
          })
        })
          describe('contains block with invalid field', () => {
            it('returns false',() => {
            

              blockchain.chain[2].data = 'some bad and evil data'
            })
            expect(Blockchain.isValidchain(blockchain.chain)).toBe(false)
          })
      
    describe('and the chain does not contain any invalid blocks', () => {
          it('returns true',() => {
            

              expect(Blockchain.isValidchain(blockchain.chain)).toBe(true)
      })
    })
    })
  })
})