import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          toAddr: '',
          contriTo: 'domain',
          contriToPerc: '0.1'
        };
    }
    
    handleAddrChange = (event) => {
        this.setState({toAddr: event.target.value});
    }

    handleContriChange = (event) => {
      this.setState({contriTo: event.target.value});
    }

    handlePercentChange = (event) => {
      this.setState({contriToPerc: event.target.value});
    }

    claimReward = () => {
      fetch("/api/claim", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toAddr: this.state.toAddr,
          contriTo: this.state.contriTo,
          contriToPerc: this.state.contriToPerc
        })
      })
      .then(res => res.json())
      .then(data => {
        this.props.getClaimStatus(data.claim);
      })  
    }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };

    return (
    <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
            <form>
                <div>
                  <label>Your Wallet Address:
                  <input type="text" name="address" onChange={this.handleAddrChange} />
                  </label>
                </div>
                <div>
                  <label>Contribute to: </label>
                  <select value={this.state.contriTo} onChange={this.handleContriChange}>
                    <option value="domain">Domain</option>
                  </select>
                  <select value={this.state.percentTo} onChange={this.handlePercentChange}>
                    <option value="0.1">10%</option>
                    <option value="0.2">20%</option>
                    <option value="0.3">30%</option>
                  </select>
                </div>
            </form>
            <p></p>
            <div className="footer">
            <button onClick={this.claimReward}>Claim</button>
            <button onClick={this.props.onClose}>Close</button>
            </div>
        </div>
    </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool
};

export default Modal;
