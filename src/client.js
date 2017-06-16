'use strict'

const EventEmitter = require('events')
const old = require('old')
const Tendermint = require('tendermint')
const { Candidate, Candidates } = require('./types.js')

class Client extends EventEmitter {
  constructor (tendermint) {
    super()
    this.rpc = Tendermint(tendermint)
    this.rpc.on('error', (err) => this.emit('error', err))
    this.on('newListener', this._onNewListener)
    this.on('removeListener', this._onRemoveListener)
  }

  // TODO: move this into js-tendermint
  _onNewListener (event, listener) {
    if (event !== 'block') return
    if (this.listenerCount('block') > 0) return
    this.rpc.subscribe({ event: 'NewBlock' }, (err, event) => {
      if (err) return this.emit('error', err)
      let { block } = event.data.data
      block.data.txs = block.data.txs.map((txBase64) => {
        let txBytes = Buffer.from(txBase64, 'base64')
        return Tx.decode(txBytes)
      })
      this.emit('block', block)
    })
  }

  _onRemoveListener (event, listener) {
    if (event !== 'block') return
    if (this.listenerCount('block') > 0) return
    this.rpc.unsubscribe({ event: 'NewBlock' })
  }

  async getCandidates () {
    let res = await this.rpc.abciQuery({
      path: '/key',
      data: Buffer.from('dg/candidates').toString('base64')
    }, next)
    if (!res.response.value) return []
    let candidatesBytes = Buffer.from(res.response.value, 'base64')
    return Candidates.decode(candidatesBytes)
  }

  async delegate (tx) {
    // TODO
    // let txBytes = Tx.encode(tx).toString('base64')
    // return yield this.rpc.broadcastTxCommit({ tx: txBytes }, next)
  }
}

module.exports = old(Client)
