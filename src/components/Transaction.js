import React, { Component } from 'react'
import cx from 'classnames'

import { cav } from 'klaytn/caver'

import './Transaction.scss'

class Tx extends Component {
  constructor() {
    super()
    this.state = {
      toAddress: '',
      txValue: 0,
      balance: '',
      isSetting: false,
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    e.preventDefault();

    if (!this.walletInstance) return

    this.setState({ settingDirection: 'plus' })

    const txObject = {
      gasPrice: '25000000000',
      gasLimit: '30000',
      from: this.walletInstance.address,
      to: this.state.toAddress,
      data: '0xff',
      value: cav.utils.toPeb(this.state.txValue, 'KLAY'),
    };

    cav.klay.sendTransaction(txObject)
      .on('transactionHash', (hash) => {
      })
      .on('receipt', (receipt) => {
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        });
      })
      .on('error', (error) => {
        alert(error.message)
        this.setState({ settingDirection: null })
      });

    // 상태 초기화
    this.setState({
      toAddress: '',
      txValue: 0
    })
  }

  txList = props => {
    const names = props.names;
    const listItem = names.map((name, idx) => {
      <li key={idx}>{name}</li>
    });
    return (
      <ul>{listItem}</ul>
    )
  };

  render() {
    const { settingDirection, txHash } = this.state
    return (
        <div>
            <form className="Tx" onSubmit={this.handleSubmit}>
        To Address:
        <input
            name="toAddress"
            value={this.state.toAddress}
            onChange={this.handleChange}
        />
        Amount to Send:
        <input
            name="txValue"
            value={this.state.txValue}
            onChange={this.handleChange}
        />
        <button
            type="submit"
            className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'plus',
            })}
        >
            SEND
        </button>
    </form>
            {txHash && (
          <div className="Count__lastTransaction">
            <p className="Count__lastTransactionMessage">
              You can check your last transaction in klaytn scope:
            </p>
            <a
              target="_blank"
              href={`https://baobab.scope.klaytn.com/tx/${txHash}`}
              className="Count__lastTransactionLink"
            >
              {txHash}
            </a>
          </div>
        )}
        </div>
    )
  }

}

export default Tx;