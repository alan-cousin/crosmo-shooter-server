import express from 'express'

const {
  authenticate,
  authError
} = require('../middlewares/auth')

const router = express.Router()

const scoreCtrl = require('../controllers/score')

router.post('/saveScore', [authenticate, authError], scoreCtrl.saveScore)

router.post('/getScores', scoreCtrl.getScores)

module.exports = router