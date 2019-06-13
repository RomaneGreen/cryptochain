const Transaction = require('./transaction')
const Wallet = require('./index')
const { verifySignature } = require('../util')
 
describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;


    beforeEach(() => {
        senderWallet = new Wallet()
        recipient = 'recipient-public-key'
        amount = 50;

        transaction = new Transaction({ senderWallet, recipient, amount })
    })

    it('has an `id`', () => {
            expect(transaction).toHaveProperty('id')
    })

    

    describe('output map', () => {

        it('has an outputMap', () => {
            expect(transaction).toHaveProperty('outputMap')
        })

        it('outputs amount to recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })


        it('outputs remaining balance for `sender wallet`',() => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount)
        })
    })

    describe('input', () => {


        it('has an input', () => {
                expect(transaction).toHaveProperty('input')
        })
        it('has a timestamp', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        })
        it('sets amount to sender wallet balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it('sets adress to senderWallet publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })
        it('signs the input', () => {
            expect(
            verifySignature({
                publicKey :senderWallet.publicKey,
                data: transaction.outputMap,
                signature : transaction.input.signature
            })).toBe(true)
        })
    })

})