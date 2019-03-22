const Blockchain = require('./blockchain')
const Block = require('./block')


describe('Blockchain', () => {

  let blockchain, newChain, originalChain;

  beforeEach(() => {
   blockchain = new Blockchain();
   newChain = new Blockchain();
   originalChain = blockchain.chain;
  })


  it('contains a `chain array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  })

  it('starts with genesis block', () => {
      expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it('adds new a block to chain', () => {
      const newData = 'foo bar'
      blockchain.addBlock({ data: newData })

      expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
})



describe('isValidChain()',() => {
  
  describe('when the chain does not start with genesis block', () => {
    it('returns false',() => {
      blockchain.chain[0] = { data: 'fake-genesis'};
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
    })
  })
  describe('when chain starts with genesis block and has multiple blocks',() => {
   
    beforeEach(() => {
       blockchain = new Blockchain();
      
      blockchain.addBlock({ data: 'bears'})
      blockchain.addBlock({ data: 'beets'})
      blockchain.addBlock({ data: 'battlstar'})
    })
  })

    describe('and a lasthash refrence has changed', () => {
      it('returns false',() => {
        
        blockchain.chain[2].lastHash = 'broken-lastHash'
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })

          describe('and the chain contains block with invalid field', () => {
            it('returns false',() => {
              blockchain.chain[2].data = 'some-bad-and-evil-data'
            })
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
          })
        })
    describe('and the chain does not contain any invalid blocks', () => {
 
          it('returns true',() => {
            

              expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
      
    })
    })
    describe('replaceChain()',() => {
        describe('when new chain is not longer',() => {
          it('does not replce chain', () => {

              newChain.chain[0] = { new: 'chain'}
              expect(blockchain.chain).toEqual(originalChain)
          })
        })
        describe('when the new chain is longer',()=> {
          beforeEach(() => {
            
           
           newChain.addBlock({ data: 'bears'})
           newChain.addBlock({ data: 'beets'})
           newChain.addBlock({ data: 'battlstar'})
         })
          describe('and chain is invalid', () => {
            it('does not replce chain', () => {

              newChain.chain[2].hash = 'some-fake-hash'
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain)
            })
          })
          describe('and chain is valid', () => {
            it('replaces chain', () => {
                blockchain.replaceChain(newChain.chain)
                expect(blockchain.chain).toEqual(newChain.chain)
            })
          })
        })
    })
  })
