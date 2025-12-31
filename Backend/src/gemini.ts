import axios from "axios";

const geminiResponse = async (
  command: string,
  assistantName: string,
  userName: string
): Promise<string> => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    if (!apiUrl) {
      console.error("GEMINI_API_URL is missing");
      return "Sorry, assistant is not configured properly.";
    }

    const prompt = `
You are a virtual assistant named ${assistantName}, created by ${userName}.
You are a voice-enabled assistant.

Respond ONLY with a valid JSON object in the following format:

{
  "type": "general" | "google-search" | "chatgpt-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<original user input>",
  "response": "<short spoken reply>"
}

Rules:
- Do NOT add any text outside JSON.
- Keep response short and voice-friendly.
- If unsure, use type "general".
- Use ${userName} if asked who created you.

User input:
${command}
`;

    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== "string") {
      console.error("Gemini returned invalid structure:", response.data);
      return "Sorry, I couldn't understand that.";
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    return "Sorry, something went wrong while responding.";
  }
};

export default geminiResponse;
