import { useState, useEffect, useCallback, useRef } from 'react'
import { sendMessage, loadConversation, resetSessionId, isAdamAvailable } from '../lib/adamClient.js'
import { adamConfig } from '../config/adam.js'

/** Hook UI Adam — état d'affichage uniquement */
export function useAdam() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)
  const sendingRef = useRef(false)

  useEffect(() => {
    if (!isAdamAvailable()) {
      setInitialized(true)
      return
    }
    loadConversation()
      .then(({ messages: history }) => {
        if (history?.length) {
          setMessages(history.map(m => ({
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
            suggestedActions: m.suggestedActions,
            diagnostic: m.diagnostic,
          })))
        } else {
          setMessages([{
            role: 'assistant',
            content: adamConfig.welcomeMessage,
            isWelcome: true,
          }])
        }
      })
      .catch(() => {
        setMessages([{
          role: 'assistant',
          content: adamConfig.welcomeMessage,
          isWelcome: true,
        }])
      })
      .finally(() => setInitialized(true))
  }, [])

  const send = useCallback(async (text) => {
    const trimmed = text?.trim()
    if (!trimmed || sendingRef.current) return

    sendingRef.current = true
    setError('')
    setLoading(true)

    const userMsg = { role: 'user', content: trimmed, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev.filter(m => !m.isWelcome), userMsg])

    try {
      const data = await sendMessage({ text: trimmed })
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          suggestedActions: data.suggestedActions,
          diagnostic: data.diagnostic,
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (e) {
      setError(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
      sendingRef.current = false
    }
  }, [])

  const reset = useCallback(() => {
    resetSessionId()
    setMessages([{
      role: 'assistant',
      content: adamConfig.welcomeMessage,
      isWelcome: true,
    }])
    setError('')
  }, [])

  return {
    messages,
    loading,
    error,
    initialized,
    available: isAdamAvailable(),
    send,
    reset,
  }
}
