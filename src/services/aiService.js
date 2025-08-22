async function generateLessonPlan({ topic, gradeLevel, objectives }) {
  // Ensure the API key is set in environment variables
  if (!process.env.GEMINI_API_KEY) throw Object.assign(new Error('Gemini API key missing'), { status: 500 });

  // Dynamically import Google Generative AI SDK
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  // Initialize the generative AI client with API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Select the generative model to use
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Build the prompt for the AI with provided topic, grade, and objectives
  const prompt = `
Create a lesson plan.
Topic: ${topic}
Grade: ${gradeLevel}
Objectives: ${(objectives || []).map(o => `- ${o}`).join('\n')}
Include: intro, key points, 30-min activities, quick assessment.
`;

  // Generate content using the AI model
  const result = await model.generateContent(prompt);

  // Return the generated text or a default message if empty
  return result.response?.text?.() || 'No content generated.';
}

module.exports = { generateLessonPlan };