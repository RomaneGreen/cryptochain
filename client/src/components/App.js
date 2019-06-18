import React, { Component } from 'react'
import Blocks from './Blocks'

import logo from '../assets/logo.png'

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
      <div className="App">
        <img src={logo} className="logo"></img> 
        <br />
      <div>  Welcome to the blockhain... </div>
      <br />
      <div className = "WalletInfo">
        <div>Address: {address} </div>
         <div>Balance: {balance} </div>
         </div>
         <br />
         <Blocks />
      </div>
    )
  }
}
