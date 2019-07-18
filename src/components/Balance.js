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
      contract: null,
    };
  }

  intervalId = null;

  // eslint-disable-next-line react/sort-comp
  getContract = () => {
    const myERC20 = require('../../loon-token/build/contracts/MyERC20.json');
    const contractAddress = '0x29921bEB9F276F8577158bf60AaBb18F33da3387';
    const contract = new cav.klay.Contract(myERC20.abi, contractAddress);
    return contract;
  };

  // eslint-disable-next-line react/sort-comp
  getInfo = async () => {
    let { balance, fromAddres, contract } = this.state;
    this.walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];
    if (this.walletInstance) {
      fromAddres = this.walletInstance.address;
      contract = this.getContract();
      balance = await contract.methods.balanceOf(fromAddres).call();
      balance = cav.utils.fromPeb(balance, 'KLAY');
    } else {
      balance = 0;
      fromAddres = '';
      contract = null;
    }
    this.setState({
      contract,
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
    const {
      fromAddres, toAddress, txValue, contract,
    } = this.state;
    if (!fromAddres) return;

    this.setState({ settingDirection: 'plus' });
    const txObject = {
      from: fromAddres,
      gas: '3000000',
    };
    contract.methods
      .transfer(toAddress, cav.utils.toPeb(txValue, 'KLAY'))
      .send(txObject)
      .on('transactionHash', (hash) => {
        console.log(hash);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        });
      })
      .on('error', console.error)
      .then(() => {
        this.setState({
          toAddress: '',
          txValue: 0,
        });
      });
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
            GEM
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
