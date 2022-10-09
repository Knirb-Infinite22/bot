const signEIP712 = require('../signEIP712')

const signMetaTx = async ({
  contract,
  method,
  signer,
  params = [],
  chainId = 1
}) => {
  const paramTypes = metaTxParamTypes[method]
  if (!paramTypes) throw new Error(`unknown method ${method}`)

  const { typedData, signature } = await signEIP712({
    signer,
    contractAddress: contract.address,
    contractName: 'BrinkAccount',
    contractVersion: '1',
    chainId,
    method,
    paramTypes,
    params
  })
  return { typedData, to: contract.address, method, signature, signer, params }
}

const metaTxPromise = async ({
  contract,
  method,
  signer,
  params = [],
  unsignedData,
  value = 0,
  chainId
}) => {
  const unsignedParams = unsignedData ? [unsignedData] : []
  const signedData = await signMetaTx({
    contract,
    method,
    signer,
    params,
    chainId
  })
  let opts = { value }
  const promise = contract[method].apply(this, [
    ...signedData.params,
    signedData.signature,
    ...unsignedParams,
    opts
  ])
  return { promise, signedData }
}

const metaTxPromiseWithSignedData = ({
  contract,
  value = 0,
  signedData,
  unsignedData
}) => {
  const unsignedParams = unsignedData ? [unsignedData] : []
  let opts = { value }
  const promise = contract[signedData.method].apply(this, [
    ...signedData.params,
    signedData.signature,
    ...unsignedParams,
    opts
  ])
  return { promise, signedData }
}

const execMetaTx = async ({
  contract,
  method,
  signer,
  params = [],
  unsignedData,
  value,
  chainId
}) => {
  const { promise, signedData } = await metaTxPromise({
    contract,
    method,
    signer,
    params,
    unsignedData,
    value,
    chainId
  })
  const tx = await promise
  return { tx, signedData }
}

const metaTxParamTypes = {
  metaCall: [
    { name: 'value', type: 'uint256' },
    { name: 'to', type: 'address' },
    { name: 'data', type: 'bytes' }
  ],
  
  metaDelegateCall: [
    { name: 'to', type: 'address' },
    { name: 'data', type: 'bytes' }
  ],
  
  metaPartialSignedDelegateCall: [
    { name: 'to', type: 'address' },
    { name: 'data', type: 'bytes' }
  ],
}


module.exports = {
  signMetaTx,
  metaTxPromise,
  metaTxPromiseWithSignedData,
  execMetaTx,
  metaTxParamTypes
}
