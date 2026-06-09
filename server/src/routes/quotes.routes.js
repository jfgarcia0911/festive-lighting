import { Router } from 'express'
import { createQuote, listQuotes } from '../controllers/quotes.controller.js'
import { validateQuote } from '../middleware/validateQuote.js'

const router = Router()

router.post('/quote', validateQuote, createQuote)
router.get('/quotes', listQuotes)

export default router