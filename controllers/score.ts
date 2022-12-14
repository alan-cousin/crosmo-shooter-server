import Web3 from 'web3'
import HDWalletProvider from "@truffle/hdwallet-provider"

import { shooterContractAddr, shooterAbi } from './web3helper'
import { getScore, setScore } from '../rooms/state'

const userService = require('../services/user')
const scoreService = require('../services/score')

const saveScore = async (req, res, next) => {
  const {
    account,
    tokenId,
    shipName,
    tier,
  } = req.body

  const myPrivateKeyHex = "347888769cf714d73fa41bbc30746298c7162124a06a518a0b3bad16edf266e4";

  const init = async () => {
    const httpProvider = new Web3.providers.HttpProvider(`https://gateway.nebkas.ro`);
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
    const localKeyProvider = new HDWalletProvider({
      privateKeys: [myPrivateKeyHex],
      providerOrUrl: httpProvider,
    });
    const web3 = new Web3(localKeyProvider);
    const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);
    const myContract = new web3.eth.Contract(shooterAbi as any, shooterContractAddr);

    try {
      // const receipt = await myContract.methods.playSession(score, account, tokenId).send({ from: myAccount.address });
    } catch (e) {
      console.log('error occured in sending reward token. try it again...')
      setTimeout(() => init(), 1000)
    }
  }
  const score = getScore()
  if (score > 0) {
    init()
  }

  const usr = await userService.findUserByAccount(account)
  if (usr) {
    const usrRes = await scoreService.saveScoreService(account, tokenId, shipName, tier, score)
    setScore(0)
    return res.json(usrRes)
  }

  return res.json({
    error: "Your account is not registered."
  })
}

const getScores = async (req, res, next) => {
  const { period, league } = req.body

  const scores = await scoreService.getScoresService(period, league)
  return res.json(scores)
}

module.exports = {
  saveScore,
  getScores
}