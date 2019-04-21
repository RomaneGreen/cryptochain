const Blockchain = require('./blockchain')
const Block = require('./block')
const cryptoHash = require('./crypto-hash')

describe('Blockchain', () => {

  let blockchain, newChain, originalChain, errorMock, logMock;

  beforeEach(() => {
   blockchain = new Blockchain();
   newChain = new Blockchain();
   errorMock = jest.fn()
   logMock = jest.fn()
   originalChain = blockchain.chain;
   global.console.error = errorMock;
   global.console.log = logMock;

  })

 
  it('contains a `chain` array instance', () => {
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
  
    describe('when chain starts with genesis block and has multiple blocks',() => {
   
    beforeEach(() => {
      
      blockchain.addBlock({ data: 'bears'})
      blockchain.addBlock({ data: 'beets'})
      blockchain.addBlock({ data: 'battlstar'})
    })

     describe('and a lasthash refrence has changed', () => {
      it('returns false',() => {
        
        blockchain.chain[2].lastHash = 'broken-lastHash'
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })
      describe('and the chain contains block with an invalid field', () => {
      it('returns false',() => {
        blockchain.chain[2].data = 'some-bad-and-evil-data'
      })
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
    })
  })
})
     describe(' and chain contains a block with jumped difficulty', () => {
 
      it('returns false',() => {
        
        const lastBlock = blockchain.chain[blockchain.chain.length -1]
        const lastHash = lastBlock.hash;
        const timestamp = Date.now()
        const nonce = 0;
        const data = []
        const difficulty = lastBlock.difficulty - 3
        const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data)
        const badBlock = new Block({ timestamp,hash, lastHash, nonce, difficulty, data
        })
          
        blockchain.chain.push(badBlock);

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

    })
    })
  
    describe('and the chain does not contain any invalid blocks', () => {
          it('returns true',() => {
              expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
      
         })
       })
      })
    
      
    describe('replaceChain()',() => {

      let logMock;

      beforeEach(() => {
            
        logMock = jest.fn();

        global.console.log = logMock;
      })
      
      
        describe('when the new chain is not longer',() => {

          beforeEach(() => {
            newChain.chain[0] = { new: 'chain' }
            blockchain.replaceChain(newChain.chain);

          })
          it('does not replace chain', () => {
              expect(blockchain.chain).toEqual(originalChain)
          })
          it('logs an error', () => {
            expect(errorMock).toHaveBeenCalled()
          })
         
        })
        
        describe('when the new chain is longer',()=> {
          beforeEach(() => {
           newChain.addBlock({ data: 'bears'})
           newChain.addBlock({ data: 'beets'})
           newChain.addBlock({ data: 'battlstar Galatica'});

         })
         
        
          describe('and chain is invalid', () => {

            beforeEach(() => {
              newChain.chain[2].hash = 'some-fake-hash';

              blockchain.replaceChain(newChain.chain);
            })

            it('does not replace chain', () => {
              
              expect(blockchain.chain).toEqual(originalChain)
            })

            it('logs an error', () => {
              expect(errorMock).toHaveBeenCalled()
            })

          })

          describe('and chain is valid', () => {
            beforeEach(() =>{
              let logMock;
              logMock = jest.fn()
              global.console.log(logMock)
              blockchain.replaceChain(newChain.chain)
            })

            it('replaces the chain', () => {
               
                expect(blockchain.chain).toEqual(newChain.chain)
            })
            it('logs about the chain replacement', () => {
              expect(logMock).toHaveBeenCalled();
            })
            
          })
        })
    })

})



  