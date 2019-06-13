const Wallet = require('./index')
const  { verifySignature } = require('../util')
const Transaction = require('./transaction')

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
})
