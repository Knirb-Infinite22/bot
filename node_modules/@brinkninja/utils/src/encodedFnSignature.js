const web3Abi = require('web3-eth-abi')

function encodedFnSignature(functionName, paramTypes) {
  const types = paramTypes.map(t => {
    const retType = t.type || t
    return retType == 'uint' ? 'uint256' : retType
  })
  const fnSig = `${functionName}(${types.join(',')})`
  return web3Abi.encodeFunctionSignature(fnSig).slice(2)
}

module.exports = encodedFnSignature
