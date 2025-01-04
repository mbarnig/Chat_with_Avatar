import { Configuration, OpenAIApi } from "openai";
import { Readable } from "stream";

// Configure OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set as an environment variable
});
const openai = new OpenAIApi(configuration);

// Maximum duration for responses
export const maxDuration = 30;

export async function POST(req) {
  try {
    // Parse the incoming request for the messages
    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call OpenAI API with the streaming option enabled
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo", // Use the desired model
      messages,
      stream: true, // Enable streaming
    });

    // Transform the response stream for readable consumption
    const readableStream = new Readable({
      read() {},
    });

    response.data.on("data", (chunk) => {
      const parsedChunk = JSON.parse(chunk.toString());
      if (parsedChunk.choices && parsedChunk.choices.length > 0) {
        const text = parsedChunk.choices[0].delta?.content || "";
        readableStream.push(text);
      }
    });

    response.data.on("end", () => {
      readableStream.push(null); // End the readable stream
    });

    response.data.on("error", (error) => {
      console.error("Error during streaming:", error);
      readableStream.destroy(error); // Handle streaming errors
    });

    // Return the readable stream as a response
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
