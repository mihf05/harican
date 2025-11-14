'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/component/ui/button'
import { Input } from '@/component/ui/input'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { aiAPI } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m **CareerBot**, your AI career mentor powered by Harican.\n\n🎯 **My Mission:** Supporting UN SDG 8 (Decent Work and Economic Growth) by helping youth like you find meaningful employment opportunities.\n\n💡 **How I can help YOU:**\n• **Job Matching:** Find roles that fit YOUR skills and experience\n• **Career Guidance:** Get personalized advice based on YOUR profile\n• **Skill Development:** Learn what to study for YOUR career goals\n• **Resume Tips:** Improve YOUR CV with specific suggestions\n• **Interview Prep:** Practice and prepare for success\n• **Career Planning:** Map out YOUR path to your dream job\n\n⚠️ **Important Disclaimers:**\n• My suggestions are recommendations only - not guarantees\n• Job market conditions vary, and success depends on many factors\n• Always verify information and make informed decisions\n• I have access to your profile to give personalized advice\n\n**What would you like to know about your career journey?**'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Quick prompt suggestions
  const quickPrompts = [
    "Which roles fit my skills?",
    "What should I learn to become a backend developer?",
    "How can I improve my chances of getting an internship?",
    "Review my CV and give suggestions",
    "What are the best entry-level jobs for my profile?"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await aiAPI.sendChatMessage(
        input,
        messages.slice(1) // Exclude initial greeting
      )

      if (response.success && response.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.data.response
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(response.message || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CareerBot - AI Career Mentor</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Powered by AI • Supporting SDG 8: Decent Work for Youth</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 max-w-[75%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                  {message.content.split('\n').map((line, i) => {
                    // Handle bold text
                    if (line.includes('**')) {
                      const parts = line.split('**')
                      return (
                        <p key={i}>
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      )
                    }
                    // Handle bullet points
                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                      return <p key={i} className="ml-2">{line}</p>
                    }
                    return <p key={i}>{line}</p>
                  })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-200 dark:border-gray-700">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts - Show only when no user messages yet */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Quick Questions:
            </p>
            <div className="flex gap-2 flex-wrap">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about careers, jobs, or professional development..."
            className="flex-1 rounded-full px-6 py-6 text-base border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-full px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
