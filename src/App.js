import React, { Component } from 'react'

import { cav } from 'klaytn/caver'
// import BlockNumber from 'components/BlockNumber'
import Auth from 'components/Auth'
import Balance from 'components/Balance'

import './App.scss'

class App extends Component {
  componentWillMount() {
    const walletFromSession = sessionStorage.getItem('walletInstance')

    // If 'walletInstance' value exists, add it to caver's wallet
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))
      } catch (e) {
        // If value in sessionStorage is invalid wallet instance,
        // remove it from sessionStorage.
        sessionStorage.removeItem('walletInstance')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Auth />
        <Balance />
      </div>
    )
  }
}

export default App
