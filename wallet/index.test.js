const Wallet = require('./index')
const  { verifySignature } = require('../util')
const Transaction = require('./transaction')
const Blockchain = require('../blockchain')
const { STARTING_BALANCE } = require('../config')

describe( 'wallet' ,() => {

 let wallet;

    beforeEach(() => {
        wallet = new Wallet()
    })

it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance')
})

it('has a `public key`', () => {
    expect(wallet).toHaveProperty('publicKey')
   // console.log(wallet.publicKey)
})


describe('sigining data', () => {

    
    
    const data = 'foobar';
    
    it('verifies a signature', () => {
        expect(
            verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)
    })

    it('Does verifies a invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
    })
    
})

   describe('createTransaction()', () => {

    describe(' and amount exceeds wallet balance',() => {
            it('throws an error as a result', () => {
                expect(() => wallet.createTransaction({amount: 999999, recipeient:'foo-recipient' })).toThrow('Amount exceeds balance') 

                
            })
    })

    describe(' and amount is valid',() => {

        let transaction , amount, recipient;

        beforeEach(() => {
            amount = 50;
            recipient = 'foo-bar';
            transaction = wallet.createTransaction({ amount, recipient })
        })
        it(`create instance of transaction`, ()=> {
                expect( transaction instanceof Transaction ).toBe(true)
        })

        it(`matches transaction input with wallet`, () => {
                    expect(transaction.input.address).toEqual(wallet.publicKey)
        })

        it(`out puts the amount to the recipient`, () => {
                expect(transaction.outputMap[recipient]).toEqual(amount)
        })
    })
   })

   describe('calculateBalance', () => {

    let blockchain ;

    beforeEach(() => {
        blockchain = new Blockchain()
    })

    describe('and there are no outputs for the wallet', () => {
        it('returns the starting balance',() => {
            expect(
                Wallet.calculateBalance({ 
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })
            ).toEqual(STARTING_BALANCE)
          
        })
    })
       
    describe('and there are outputs for the wallet',() => {
        let transactionOne, transactionTwo;

        beforeEach(() => {
            transactionOne = new Wallet().createTransaction({
                recipient: wallet.publicKey,
                amount: 50
            })

            transactionTwo = new Wallet().createTransaction({
                recipient: wallet.publicKey,
                amount: 60
            })
            blockchain.addBlock({ data: [ transactionOne, transactionTwo ]})
        })
    

   it('adds the sum of all outputs to the wallet balance', () => {
       expect(
           Wallet.calculateBalance({
               chain: blockchain.chain,
               address: wallet.publicKey
           })
       ).toEqual(
           STARTING_BALANCE + 
           transactionOne.outputMap[wallet.publicKey] +
           transactionTwo.outputMap[wallet.publicKey]
       )
   })
   })
})
})