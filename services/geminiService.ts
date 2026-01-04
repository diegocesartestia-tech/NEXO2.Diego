
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  constructor() {}

  // Mantemos o generator para não quebrar a UI do App.tsx que espera um stream
  async *sendMessageStream(history: Message[], newMessage: string, aiName: string, userName: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          message: newMessage,
          aiName,
          userName,
          systemInstruction: SYSTEM_INSTRUCTION
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na comunicação com a API');
      }

      const data = await response.json();
      
      // Como a rota retorna JSON completo, emitimos o texto em um único chunk
      // para manter compatibilidade com o loop 'for await' do frontend
      if (data.text) {
        yield data.text;
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  }

  async generateInsights(messages: Message[]): Promise<any[]> {
    // Para insights, podemos criar outra rota ou adaptar esta. 
    // Por brevidade, vamos manter a lógica de chamada via API se necessário, 
    // mas o foco principal foi o chat principal.
    return []; 
  }
}

export const geminiService = new GeminiService();
