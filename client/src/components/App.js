import React, { Component } from 'react'
import ReactDOM from 'react-dom'


export default class App extends Component {

  state = {
      walletInfo: { address: 'foov6', balance: 9999 }
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
      </div>
    )
  }
}
