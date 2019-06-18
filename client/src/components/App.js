import React, { Component } from 'react'
import Blocks from './Blocks'
import ReactDOM from 'react-dom'


export default class App extends Component {

  state = {
      walletInfo: { address: null, balance: null }
  }

  
  componentDidMount() {
    fetch('http://localhost:3000/api/wallet-info').then(response => response.json()).then( json => this.setState({
        walletInfo: json
    })
    ) 
    
  }
  
  render() {
     
    const { address, balance } = this.state.walletInfo
    return (
      <div>
      <div>  Welcome to the blockhain... </div>
        <div>Address: {address} </div>
         <div>Balance: {balance} </div>
         <br />
         <Blocks />
      </div>
    )
  }
}
