const ethJsAbi = require('ethereumjs-abi')
const { bufferToHex } = require('ethereumjs-util')

const computeAccountBytecode = (proxyBytecode, implementationAddress, ownerAddress) => {
  const encodedParameters = bufferToHex(
    ethJsAbi.rawEncode(
      ['address', 'address'],
      [implementationAddress, ownerAddress]
    )
  ).replace('0x', '')
  return `${proxyBytecode}${encodedParameters}`
}

module.exports = computeAccountBytecode
