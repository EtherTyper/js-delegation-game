'use strict'

const struct = require('varstruct')
const crypto = require('tendermint-crypto')

const field = (name, type) => ({ name, type })

module.exports = struct([
  field('validatorPubKey', crypto.PubKey),
  field('signature', crypto.Signature),
  field('name', struct.VarString(crypto.varint)),
  field('message', struct.VarString(crypto.varint)),
  field('interestCommission', struct.UInt32BE)
])
