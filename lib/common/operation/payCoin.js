'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * payCoin operation
 * @param {string} args
 * @returns {string}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, destAddress, gasAmount, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));
    const payCoin = root.lookupType('protocol.OperationPayCoin');
    const payCoinMsg = payCoin.create({
      destAddress,
      amount: long.fromValue(gasAmount),
    });

    const operation = root.lookupType('protocol.Operation');
    const payload = {
      payCoin: payCoinMsg,
      type: operation.Type.PAY_COIN,
      sourceAddress,
    };

    if (metadata) {
      payload.metadata = (Buffer.from(metadata, 'utf8')).toString("hex");
    }

    const err = operation.verify(payload);

    if (err) {
      throw Error(err);
    }

    return operation.create(payload);
  } catch (err) {
    throw err;
  }
};
