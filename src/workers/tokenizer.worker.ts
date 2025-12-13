import { encode } from 'gpt-tokenizer'
import { encode as encodeCl100k } from 'gpt-tokenizer/encoding/cl100k_base'

export interface TokenizerMessage {
  text: string
  model?: 'o200k_base' | 'cl100k_base'
}

export interface TokenizerResponse {
  tokens: number[]
  count: number
  model: string
}

self.onmessage = (e: MessageEvent<TokenizerMessage>) => {
  const { text, model = 'o200k_base' } = e.data

  try {
    let tokens: number[]

    if (model === 'cl100k_base') {
      tokens = encodeCl100k(text)
    } else {
      tokens = encode(text)
    }

    self.postMessage({
      tokens,
      count: tokens.length,
      model
    } as TokenizerResponse)
  } catch (error) {
    console.error('Tokenizer error:', error)
    self.postMessage({
      tokens: [],
      count: 0,
      model
    } as TokenizerResponse)
  }
}