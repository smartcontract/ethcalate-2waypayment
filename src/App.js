/* globals state */

import React, { Component } from 'react'
import DesktopComponent from './js/components/DesktopComponent'

import Ethcalate from './ethcalate-client'

class App extends Component {
  state = {
    ethcalate: null,
    myChannels: []
  }

  async componentDidMount () {
    try {
      await this.instantiateContract()
      await this.getMyChannels()
    } catch (e) {
      console.log(e)
    }
  }

  async instantiateContract () {
    const ethcalate = new Ethcalate()
    // TODO: YIKES
    while (!ethcalate.account) {
      await ethcalate.initContract()
    }
    this.setState({
      ethcalate
    })
    console.log(ethcalate.channelManager.address)
  }

  async getMyChannels () {
    const { ethcalate } = this.state
    const myChannels = await ethcalate.getMyChannels()
    console.log('myChannels: ', myChannels)
    this.setState({
      myChannels
    })
  }

  render () {
    const { ethcalate, myChannels } = this.state

    return (
      <div className='App'>
        <div>
          <DesktopComponent ethcalate={ethcalate} myChannels={myChannels} />
        </div>

      </div>
    )
  }
}

export default App
