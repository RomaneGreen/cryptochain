import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Transaction from './Transaction'


export default class Block extends Component {

  state = {
    displayTransaction: false
  }

  toggleTransaction = () => {

    this.setState({
      displayTransaction: !this.state.displayTransaction
    })
  }

  get displayTransaction () {

    const { data }  = this.props.block;

    const stringifiedData = JSON.stringify(data)

    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0,35)}...` : stringifiedData

  
    if (this.state.displayTransaction) {
      return (
      <div>
        {
          data.map(transaction => (<div key={transaction.id}> <hr /> <Transaction transaction={transaction} /></div>))
        }
        {JSON.stringify(data)}
        <br /> 
      <Button 
      bsStyle="danger"
      bsSize="small"
      onClick={this.toggleTransaction}>
        show less
        </Button> 
    </div>  
      ) 
    }
   
   return ( <div>Data: {dataDisplay}
           <Button 
          bsStyle="danger"
          bsSize="small"
          onClick={this.toggleTransaction}>show more</Button>
   </div> 
   )
    }
  
  render() {

    console.log('display transaction', this.displayTransaction)

    const { timestamp,hash }  = this.props.block

    const hashDisplay =  `${hash.substring(0,15)}...`;


   

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>  
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>  
        {this.displayTransaction}
      </div>
    )
  }
}
