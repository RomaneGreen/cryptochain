const Transaction = require('../wallet/transaction')

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {

        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }
        mineTransactions() {

            const validTransactions = this.transactionPool.validTransactions()

            validTransactions.push(Transaction.rewardTransaction({ minerWallet: this.wallet}))

            this.blockchain.addBlock({ data: validTransactions })

            this.pubsub.broadcastChain()

            this.transactionPool.clear()
            // get mined transaction
            // get miners reward
            // add block of these transactions to chain
            // broadcast updated blockchain
            // clear the pool 

        }
}

module.exports = TransactionMiner;