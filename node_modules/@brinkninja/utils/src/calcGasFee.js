async function calcGasFee(web3Tx) {
  throw new Error('NOT IMPLEMENTED. need to add ethers.js to calcGasFee() in @brinkninja/brink-test-helpers')
  // const { tx, receipt } = web3Tx
  // const gasPrice = BN((await web3.eth.getTransaction(tx)).gasPrice)
  // const gasUsed = BN(receipt.gasUsed)
  // const gasFee = gasUsed.mul(gasPrice)
  // return gasFee
}

module.exports = calcGasFee
