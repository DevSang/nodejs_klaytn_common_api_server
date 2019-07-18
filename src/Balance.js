import React, { Component } from 'react';
import cx from 'classnames';

import { cav } from 'klaytn/caver';

import './Balance.scss';

class Balance extends Component {
  constructor() {
    super();
    this.state = {
      toAddress: '',
      fromAddres: null,
      balance: 0,
      txValue: 0,
      txList: [],
      isSetting: false,
    };
  }

  intervalId = null;

  // eslint-disable-next-line react/sort-comp
  getInfo = async () => {
    let { balance, fromAddres } = this.state;
    this.walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];
    if (this.walletInstance) {
      fromAddres = this.walletInstance.address;
      balance = await cav.klay.getBalance(fromAddres);
      console.log(JSON.stringify(balance));
      balance = cav.utils.fromPeb(balance, 'KLAY');
    } else {
      balance = 0;
      fromAddres = '';
    }
    this.setState({
      balance,
      fromAddres,
    });
  };

  componentDidMount() {
    this.intervalId = setInterval(this.getInfo, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    e.preventDefault();
    const { fromAddres, toAddress, txValue } = this.state;
    if (!fromAddres) return;

    this.setState({ settingDirection: 'plus' });

    const txObject = {
      gasPrice: '25000000000',
      gasLimit: '30000',
      from: fromAddres,
      to: toAddress,
      data: '0xff',
      value: cav.utils.toPeb(txValue, 'KLAY'),
    };

    cav.klay
      .sendTransaction(txObject)
      .on('transactionHash', (hash) => {})
      .on('receipt', (receipt) => {
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        });
      })
      .on('error', (error) => {
        alert(error.message);
        this.setState({
          settingDirection: null,
          toAddress: '',
          txValue: 0,
        });
      })
      .then(() => {
        this.setState({
          toAddress: '',
          txValue: 0,
        });
      });

    // 상태 초기화
  };

  render() {
    const {
      balance, settingDirection, txHash, fromAddres,
    } = this.state;
    return (
      <div className="Balance">
        <div className="Balance__wallet">
          <div className="Balance__wallet_name">Wallet Addres: </div>
          <div className="Balance__wallet_address">
            {fromAddres && (
              <a target="_blank" href={`https://baobab.scope.klaytn.com/account/${fromAddres}`}>
                {fromAddres}
              </a>
            )}
          </div>
        </div>
        <div className="Balance__balance">Balance: {balance}</div>
        <form className="Balance__tx" onSubmit={this.handleSubmit}>
          <div>
            <span className="Balance__tx_name">To Address:</span>
            <input name="toAddress" value={this.state.toAddress} onChange={this.handleChange} />
          </div>
          <div>
            Amount to Send:
            <input name="txValue" value={this.state.txValue} onChange={this.handleChange} />
            KLAY
          </div>
          <button
            type="submit"
            className={cx('Balance__button', {
              'Balance__button--setting': settingDirection === 'plus',
            })}
          >
            SEND
          </button>
        </form>
        {txHash && (
          <div className="Balance__lastTransaction">
            <p className="Balance__lastTransactionMessage">
              You can check your last transaction in klaytn scope:
            </p>
            <a
              target="_blank"
              href={`https://baobab.scope.klaytn.com/tx/${txHash}`}
              className="Balance__lastTransactionLink"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default Balance;
