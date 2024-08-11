// services/openaiService.js
const OpenAI = require('openai');
const { PassThrough } = require('stream');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateChatResponse(messages) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: false,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  async generateStreamingChatResponse(messages) {
    const stream = new PassThrough();

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: true,
      });

      for await (const chunk of response) {
        if (chunk.choices[0]?.delta?.content) {
          stream.write(chunk.choices[0].delta.content);
        }
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      stream.emit('error', error);
    } finally {
      stream.end();
    }

    return stream;
  }
}

module.exports = new OpenAIService();