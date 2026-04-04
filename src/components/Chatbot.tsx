import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './Chatbot.css'

interface Message {
  role: 'ai' | 'user'
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '### Welcome to ShopSmart AI!\n\nI\'m your personal assistant designed to help you find the best deals and products. How can I assist you today?' },
  ])
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isTyping])

  // Simulation of "streaming" text for a more dynamic feel
  const simulateStreaming = async (text: string) => {
    setIsTyping(true)
    let currentText = ''
    const words = text.split(' ')
    
    // Add AI message placeholder
    setMessages((prev) => [...prev, { role: 'ai', content: '' }])
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i]
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = currentText
        return newMessages
      })
      // Random delay to feel more natural
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40))
    }
    setIsTyping(false)
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || loading || isTyping) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5).map((m) => ({ 
            role: m.role === 'ai' ? 'assistant' : 'user', 
            content: m.content 
          })),
        }),
      })

      const data = await response.json()
      setLoading(false)
      
      if (data.response) {
        await simulateStreaming(data.response)
      } else {
        await simulateStreaming('I apologize, but I\'m having trouble processing that right now. Please try again or explore our categories!')
      }
    } catch {
      setLoading(false)
      await simulateStreaming('It looks like I\'ve gone offline for a moment. Please check your connection or try again later!')
    }
  }

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          className="chatbot-bubble"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <header className="chatbot-header">
            <div className="chatbot-header__info">
              <span className="chatbot-header__title">ShopSmart Assistant</span>
              <span className="chatbot-header__status">● Online</span>
            </div>
            <button
              className="chatbot-header__close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </header>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message chatbot-message--${msg.role}`}
              >
                {msg.role === 'ai' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {loading && !isTyping && (
              <div className="chatbot-typing">Thinking</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-footer" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading || isTyping}
            />
            <button 
              type="submit" 
              className="chatbot-send" 
              disabled={loading || isTyping || !input.trim()}
            >
              ➜
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
