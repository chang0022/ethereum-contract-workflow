const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

// 1. 获取 bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json')
const { interface, bytecode } = require(contractPath)

// 2. 配置 provider
const provider = new HDWalletProvider(
  'amount oak season rookie meadow eternal remove dynamic foster special trick produce',
  'https://rinkeby.infura.io/MrQ30W7IqX4mR23RU8c3'
)

// 3. 初始化 web3 实例
const web3 = new Web3(provider)
;(async () => {
  // 4. 获取钱包里面的账户
  const accounts = await web3.eth.getAccounts()
  console.log('部署合约的账户：', accounts[0])

  // 5. 创建合约实例并部署
  console.time('Contract-deploy')
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: `0x${bytecode}`, arguments: ['AUDI'] })
    .send({ from: accounts[0], gas: '1000000' })
  console.timeEnd('Contract-deploy')

  console.log('合约部署成功：', result.options.address)
})()
