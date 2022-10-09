async function randomAddress () {
  const { address, privateKey } = await this.ethers.Wallet.createRandom()
  return { address, privateKey }
}

module.exports = randomAddress
