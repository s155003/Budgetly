const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getBudgetAdvice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { budget_data, spending_data, goals } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const prompt = `
You are a financial advisor helping a user with their budget. Here's their financial information:

Budget: $${budget_data?.monthly_income || 0} monthly income
Spending: ${JSON.stringify(spending_data || {})}
Goals: ${JSON.stringify(goals || [])}

Please provide:
1. 2-3 specific, actionable budget tips
2. Identify any concerning spending patterns
3. Suggest realistic savings strategies
4. Keep advice practical and encouraging for someone in Middle America

Format your response as JSON with this structure:
{
  "tips": ["tip1", "tip2", "tip3"],
  "concerns": ["concern1", "concern2"],
  "savings_strategies": ["strategy1", "strategy2"],
  "encouragement": "motivational message"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor focused on practical, actionable advice for everyday Americans. Be encouraging and realistic."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(response);
      res.json({ advice: parsedResponse });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      res.json({ 
        advice: {
          tips: [response],
          concerns: [],
          savings_strategies: [],
          encouragement: "Keep working on your financial goals!"
        }
      });
    }
  } catch (error) {
    console.error('AI advice error:', error);
    res.status(500).json({ error: 'Failed to get AI advice' });
  }
};

const getLessonHint = async (req, res) => {
  try {
    const { lesson_content, user_question, difficulty_level } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const prompt = `
You are a financial education tutor. A student is working on this lesson:

${lesson_content}

They asked: "${user_question}"

Difficulty level: ${difficulty_level || 'beginner'}

Provide a helpful hint that:
1. Guides them toward the answer without giving it away
2. Explains the concept in simple terms
3. Uses relatable examples for everyday Americans
4. Is encouraging and supportive

Keep your response under 200 words.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a patient, encouraging financial education tutor. Help students learn by guiding them to discover answers themselves."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const hint = completion.choices[0].message.content;
    res.json({ hint });
  } catch (error) {
    console.error('AI hint error:', error);
    res.status(500).json({ error: 'Failed to get lesson hint' });
  }
};

const generateQuizQuestions = async (req, res) => {
  try {
    const { topic, difficulty_level = 'beginner', num_questions = 5 } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const prompt = `
Generate ${num_questions} multiple choice quiz questions about ${topic} for ${difficulty_level} level.

Each question should:
- Be practical and relevant to everyday Americans
- Have 4 answer choices (A, B, C, D)
- Include a brief explanation for the correct answer
- Be clear and unambiguous

Format as JSON:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Why this answer is correct"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial education expert creating quiz questions. Focus on practical, real-world scenarios."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(response);
      res.json({ questions: parsedResponse.questions });
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('AI quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
};

module.exports = {
  getBudgetAdvice,
  getLessonHint,
  generateQuizQuestions
};

