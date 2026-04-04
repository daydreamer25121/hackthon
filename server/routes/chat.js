import { Router } from 'express'
import OpenAI from 'openai'

export const chatRouter = Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are ShopSmart AI, a helpful and friendly e-commerce assistant for the ShopSmart platform. 
Your goal is to help users find products, explain features, and provide a premium shopping experience.
Keep your responses concise, professional, and slightly enthusiastic. 
Always use Markdown formatting for lists and bold text.`

const MOCK_RESPONSES = [
  "I'm here to help you find the perfect products! We have great deals in **Electronics** and **Clothes** right now. Which one would you like to explore?",
  "ShopSmart is designed to provide you with the best shopping experience. You can browse categories, check reviews, and even get personalized recommendations!",
  "That's a great question! Our current bestsellers include the **Wireless Noise-Canceling Headphones** and **Smart Watch Pro**. Would you like to see more details?",
  "I'm ShopSmart AI, your personal shopping assistant. I can help you track orders, find deals, or explain our premium features. What's on your mind?",
]

chatRouter.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body ?? {}
    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
      ]

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
      })

      const response = completion.choices[0].message.content
      return res.json({ response })
    } catch (apiError) {
      // Fallback logic if OpenAI fails (e.g. quota exceeded)
      console.warn('OpenAI API Error, using fallback:', apiError.message)
      
      // Pick a semi-random mock response that feels natural
      const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
      return res.json({ 
        response: mockResponse + "\n\n*(Note: I'm currently running in Demo Mode while we check our AI connection!)*" 
      })
    }
  } catch (error) {
    console.error('Chat Route Error:', error)
    return res.status(500).json({ message: 'AI Assistant is currently offline' })
  }
})
