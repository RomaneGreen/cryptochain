import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {  Router, Switch, Route } from 'react-router-dom'
import history from './history'
import  App from './components/App'
import Blocks from './components/Blocks'
import './index.css'



   


ReactDOM.render(<Router history={history}>
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/blocks' component={Blocks} />
    </Switch>
</Router> 
,document.getElementById('root'))


