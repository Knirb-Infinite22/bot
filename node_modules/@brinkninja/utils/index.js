const { BigNumber } = require('@ethersproject/bignumber')

module.exports = {
  get BN () { return BigNumber.from },
  get bnToBinaryString () { return require('./src/bnToBinaryString') },
  get constants () { return require('./src/constants') },
  get calcGasFee () { return require('./src/calcGasFee') },
  get computeAccountBytecode () { return require('./src/computeAccountBytecode') },
  get deployData () { return require('./src/deployData') },
  get encodedFnSignature () { return require('./src/encodedFnSignature') },
  get encodedParams () { return require('./src/encodedParams') },
  get encodeFunctionCall () { return require('./src/encodeFunctionCall') },
  get signEIP712 () { return require('./src/signEIP712') },
  get splitCallData () { return require('./src/splitCallData') },
  get testHelpers() { return require('./src/testHelpers') },
}
