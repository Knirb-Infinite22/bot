const web3Utils = require('web3-utils')
const computeAccountBytecode = require('./computeAccountBytecode')

const deployData = (deployerAddress, proxyBytecode, implementationAddress, ownerAddress, accountDeploymentSalt) => {
  const initCode = computeAccountBytecode(proxyBytecode, implementationAddress, ownerAddress)
  const codeHash = web3Utils.soliditySha3({ t: 'bytes', v: initCode })
  const addressAsBytes32 = web3Utils.soliditySha3(
    { t: 'uint8', v: 255 }, // 0xff
    { t: 'address', v: deployerAddress },
    { t: 'bytes32', v: accountDeploymentSalt },
    { t: 'bytes32', v: codeHash }
  )
  const address = `0x${addressAsBytes32.slice(26,66)}`
  return {
    address,
    initCode
  }
}

module.exports = deployData