import { OpenAI } from "openai";
import { Readable } from "stream";

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Ensure your API key is set as an environment variable
});

// Maximum duration for responses
export const maxDuration = 30;

// Type definition for incoming request body
interface ChatRequestBody {
  messages: { role: string; content: string }[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the incoming request body
    const { messages }: ChatRequestBody = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call OpenAI API with streaming enabled
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      stream: true,
    });

    // Create a readable stream to handle the streaming response
    const readableStream = new Readable({
      read() {},
    });

    // Process the streamed response
    for await (const chunk of response) {
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk.choices && parsedChunk.choices.length > 0) {
        const text = parsedChunk.choices[0].delta?.content || "";
        readableStream.push(text);
      }
    }

    readableStream.push(null); // Mark the stream as complete

    // Return the stream as a response
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing the request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
