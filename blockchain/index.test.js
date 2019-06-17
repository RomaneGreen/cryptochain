const Blockchain = require('./index')
const Block = require('./block')
const { cryptoHash }= require('../util')
const Wallet = require('../wallet')
const Transaction = require('../wallet/transaction')

describe('Blockchain', () => {

  let blockchain, newChain, originalChain, errorMock, logMock;

  beforeEach(() => {
   blockchain = new Blockchain();
   newChain = new Blockchain();

   
   errorMock = jest.fn()

   originalChain = blockchain.chain;
   global.console.error = errorMock;
  

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
  })


    describe('when chain starts with genesis block and has multiple blocks',() => {
   
    beforeEach(() => {

      blockchain.addBlock({ data: 'Bears'})
      blockchain.addBlock({ data: 'Beets'})
      blockchain.addBlock({ data: 'Battlstar Gallactia'})
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
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
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
              logMock = jest.fn()
              
                global.console.log = logMock
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
           newChain.addBlock({ data: 'Bears'})
           newChain.addBlock({ data: 'Beets'})
           newChain.addBlock({ data: 'Battlstar Galatica'});

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
        
       

          describe('and the validTransactions flag is true', () => {

            it('calls validTransactionData()', () => {
              
              

                const validTransactionDataMock = jest.fn()
              

              blockchain.validTransactionData = validTransactionDataMock;

              newChain.addBlock({ data: 'foo' })
              blockchain.replaceChain(newChain.chain, true)

              expect(validTransactionDataMock).toHaveBeenCalled();
            })
          })
        
        })

      
    
   describe('validTransactionData()', () => {
     let transaction, rewardTransaction, wallet;

     beforeEach(() => {
       wallet = new Wallet(); 
       transaction = wallet.createTransaction({ recipient: 'foo-address', amount: 66 })
       rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet })
     })


      describe('transaction data is valid', () => {
        it('returns true', ()=> {
          newChain.addBlock({ data: [transaction,rewardTransaction]})

         expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true)
         expect(errorMock).not.toHaveBeenCalled()

        })
      })

      describe('transaction data has multiple rewards', ()=> {
        it(' it return false and logs error', ()=> {
          newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction]})

          expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })

      })

    
        describe('has at least one malformed output map', ()=> {
        
          describe('the transaction is not a reward transaction', ()=> {
            it('should return false and logs error', ()=> {

              transaction.outputMap[wallet.publicKey] = 99999;
              newChain.addBlock({ data: [transaction, rewardTransaction]})


              expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
              expect(errorMock).toHaveBeenCalled()
             }) 
          })

          describe('transaction is a reward transaction', ()=> {
            it('should return false and logs error', ()=> { 

              rewardTransaction.outputMap[wallet.publicKey] = 9999999999;
              newChain.addBlock({ data: [transaction, rewardTransaction ]})
              expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
              expect(errorMock).toHaveBeenCalled() 

            })


          })
          
          })


          describe('transaction data has at least one malformed output', ()=> {
            it('should return false and log an error', ()=> { 
              wallet.balance = 9000;

              const evilOutputMap = {
                [wallet.publicKey]: 8900,
                fooRecipient: 100
              }

              const evilTransaction = {
                input: {
                    timestamp: Date.now(),
                    amount: wallet.balance,
                    address: wallet.publicKey,
                    signature: wallet.sign(evilOutputMap)
                },

              
              outputMap: evilOutputMap

              }
              newChain.addBlock({ data: [evilTransaction, rewardTransaction]})

              expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
                expect(errorMock).toHaveBeenCalled()
          })
        })
          describe('and block contains multiple idential transactions', () => {
            it('returns false and logs an error', ()=> { 

            newChain.addBlock({data: [transaction, transaction, transaction, rewardTransaction]})
            expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false)
            expect(errorMock).toHaveBeenCalled()
          
          })
          })
        })
        })