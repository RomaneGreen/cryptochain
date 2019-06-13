const Wallet = require('./index')
const  { verifySignature } = require('../util/index')

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
})
