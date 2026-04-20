import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Get the API key from localStorage
const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || '';
};

export const setApiKey = (key) => {
  localStorage.setItem('gemini_api_key', key);
};

export const hasApiKey = () => {
  return !!localStorage.getItem('gemini_api_key');
};

const callGemini = async (prompt) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Please set your Gemini API key in settings.');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Gemini API key.');
    }
    throw new Error('AI service unavailable. Please try again later.');
  }
};

export const generateSummary = async (topic, subject) => {
  const prompt = `You are a helpful study assistant. Generate a clear, concise, and well-structured summary for the topic "${topic}" in the subject "${subject}". 
  
  Include:
  - Key concepts and definitions
  - Important points to remember
  - Real-world applications where relevant
  
  Format the response with clear headings and bullet points. Keep it student-friendly.`;

  return callGemini(prompt);
};

export const generateQuestions = async (topic, subject, count = 5) => {
  const prompt = `You are a study assistant. Generate ${count} practice questions for the topic "${topic}" in the subject "${subject}".
  
  Include a mix of:
  - Multiple choice questions (with 4 options and correct answer marked)
  - Short answer questions
  - One conceptual/analytical question
  
  Format each question clearly with numbers. For MCQs, mark the correct answer.`;

  return callGemini(prompt);
};

export const generateFlashcards = async (topic, subject, count = 8) => {
  const prompt = `You are a study assistant. Generate ${count} flashcards for the topic "${topic}" in the subject "${subject}".
  
  Format each flashcard as:
  
  **Card [number]**
  **Front:** [Question or term]
  **Back:** [Answer or definition]
  
  Make them concise and useful for quick revision.`;

  return callGemini(prompt);
};
