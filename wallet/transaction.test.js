const Transaction = require('./transaction')
const Wallet = require('./index')
const { verifySignature } = require('../util')
const { REWARD_INPUT , MINING_REWARD } = require('../config')

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
            expect(verifySignature({ publicKey : senderWallet.publicKey, data: transaction.outputMap, signature : transaction.input.signature
            })).toBe(true)
        })     
    })


     describe('validTransaction()', () => {

         let errorMock;

        beforeEach(() => {
            errorMock = jest.fn()
            global.console.error = errorMock
        })
        describe('when transaction is valid', ()=> {
                it('returns true', () => {
                    expect(Transaction.validTransaction(transaction)).toBe(true)
                })
        })
        describe('when transaction is Invalid', ()=> {

            describe('and a outputMap is invalid',() => {

                it('returns false and logs an error',() => {

                    transaction.outputMap[senderWallet.publicKey] = 99999;
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })

            })
        
            describe('and the input signature is invalid', () => {

                it('returns false and logs an error',() => {

                    transaction.input.signature = new Wallet().sign('data')
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })

            })
        })
    })
            describe('update()', () => {

                let originalSignature, originalSenderOutput, nextRecipient, nextAmount;


                describe('and the amount is invalid', () => {
                   
                    it('throws an error', () => {
                        expect(()=> {
                            transaction.update({ senderWallet, recipient:'foo', amount: 99999 })

                        }).toThrow('Amount exceeds balance')
                    })
                })
             

            describe('and the amount is valid', () => {
                beforeEach(() => {
                    originalSignature = transaction.input.signature;
                    originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                    nextRecipient = 'next-recipient';
                    nextAmount = 50;

                    transaction.update({ senderWallet , recipient: nextRecipient, amount: nextAmount})
                })
                it('outputs amount to next recipient', () => {
                        expect(transaction.outputMap[nextRecipient] = nextAmount)
                })

                it('subtracts amount from original senders output amount', () => {
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount)
                })

                it('maintains total output value that matches inputs amount', () => {
                   expect(Object.values(transaction.outputMap).reduce((total, outputAmount) => total + outputAmount)).toEqual(transaction.input.amount)
                })
                it('re-signs transactions', () => {
                    expect(transaction.input.signature).not.toEqual(originalSignature)
                })

                describe('and another update for same recipient', () => {
                    let addedAmount;

                    beforeEach(() => {
                        addedAmount = 80
                        transaction.update({ senderWallet, recipient: nextRecipient, amount: addedAmount})
                    })
                   

                it('adds to the recipient amount', () => {
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount)
                })

                it('subtracts amount from original sender output amount', () => {
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount - addedAmount)
                })
            })

            describe('rewardTransactions()', () => {

                    let rewardTransaction, minerWallet;

                    beforeEach(() => {
                        minerWallet = new Wallet()
                        rewardTransaction = Transaction.rewardTransaction({ minerWallet })
                    })
                it('creates 1 trnasaction for the miner with the reward', () => {
                        expect(rewardTransaction.input).toEqual(REWARD_INPUT)
                })


                it('creates on transaction from miner with the `MINING_REWARD', () => {
                    expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD)
                })


                it('', () => {
                    
                })
            })
                
        }) 
           
            })
       
        })