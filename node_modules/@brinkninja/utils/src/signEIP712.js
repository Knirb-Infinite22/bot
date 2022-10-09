const _ = require('lodash')
const { TypedDataUtils } = require('eth-sig-util')

// signer is an ethers.js signer with _signTypedData() implemented
async function signEIP712 ({
  signer,
  contractAddress,
  contractName,
  contractVersion,
  chainId,
  method,
  paramTypes,
  params
}) {
  const domain = {
    name: contractName,
    version: contractVersion,
    chainId: chainId,
    verifyingContract: contractAddress
  }
  const { typedData, typedDataHash } = _getTypedData(domain, method, paramTypes, params)
  const signature = await _signTypedData(signer, typedData)
  return { typedData, signature, typedDataHash }
}

async function _signTypedData(signer, typedData) {
  const signedData = await signer._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.value
  )
  return signedData
}

function _getTypedData (domain, method, paramTypes, params) {
  const methodType = _capitalize(method)
  let typedData = {
    types: {
      [`${methodType}`]: paramTypes
    },
    domain,
    value: { }
  }
  for (var i in paramTypes) {
    const { name } = paramTypes[i]
    const paramValue = params[i]
    if (_.isUndefined(paramValue)) throw new Error(`No value for param "${name}"`)
    typedData.value[name] = paramValue.toString()
  }

  return { typedData, typedDataHash: _getTypedDataHash(typedData, methodType) }
}

function _getTypedDataHash (typedData, primaryType) {
  // ethers signer _signTypedData method doesn't return the hash, so use eth-sig-util to generate
  // the hash that was signed. It requires the domain type to be explicitly defined, and expects
  // the `message` property instead of `value`
  //
  // TypedDataUtils.sign is a poorly named function from
  // eth-sig-utils (metamask's signer utility). It generates the hashed message
  // from the given typed data, it doesn't actually do any signing
  return `0x${TypedDataUtils.sign({
    types: {
      ...typedData.types,
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
      ]
    },
    primaryType,
    domain: typedData.domain,
    message: typedData.value
  }).toString('hex')}`
}

const _capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = signEIP712
