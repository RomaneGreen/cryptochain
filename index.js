const express = require('express')
const Blockchain = require('./blockchain/index')
const request = require('request')
const bodyParser = require('body-parser')
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transaction-pool')
const transactionPool = new TransactionPool()
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain })
const Wallet = require('./wallet')
const wallet = new Wallet()
const DEFAULT_PORT = 3000

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`


setTimeout(() => pubsub.broadcastChain(), 1000)

app.use(bodyParser.json())

app.get('/api/blocks', (req,res) => {

res.json(blockchain.chain);

})

const syncChains = () => {
    request({url : `${ROOT_NODE_ADDRESS}/api/blocks` }, (error,response,body,) => {
            if (!error && response.statusCode === 200) {
                const rootChain = JSON.parse(body)

                console.log('replace chain on sync', rootChain);
                blockchain.replaceChain(rootChain)
            }
    })
}

app.post('/api/mine',(req,res) => {

const { data } = req.body;

blockchain.addBlock({ data });

pubsub.broadcastChain()

res.redirect('/api/blocks')

})

app.post('/api/transact',(req,res) => {

    const {amount,recipient} = req.body

    let transaction;
    try {
        transaction  = wallet.createTransaction({ amount , recipient })

    }catch(error){
      return  res.status(400).json({type: error, message: error.message})
    }
    
    
    transactionPool.setTransaction(transaction)
    console.log('transactionpool', transactionPool)

    res.json({ type:success, transaction })
})
let PEER_PORT; 

if (process.env.GENERATE_PEER_PORT === 'true') {
        PEER_PORT = DEFAULT_PORT  + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT,() => {

    console.log(`app is listening on localhost:${PORT}`)
    if (PORT !== DEFAULT_PORT) {
    syncChains();
    }
})
