export async function sendMessage( message, sessionId ){

 try{

   const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/chat`,

   {
   method: "POST",

   headers:{
      "Content-Type":
      "application/json"
   },

   body:
   JSON.stringify({ message, sessionId })

 });

 const data =
 await res.json();

 return data;

 } catch ( error ){

 console.error( "Error sending message:", error );

 throw error;

 }

}

export async function streamMessage( message, sessionId, onChunk, signal ){
  const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/chat/stream`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, sessionId })
  });
  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}`
    );
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const cleanedChunk = chunk.replace(/^data: /, "").trim();
    fullResponse += cleanedChunk;
    onChunk(fullResponse);
  }
  return fullResponse;
}

export async function getAnalytics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_API}/analytics`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}

export async function getChatHistory(sessionId) {
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/chat/${sessionId}`);
    if(!res.ok){
      throw new Error("Failed to fetch history");
    }
    return await res.json();
  }catch(err){
    console.error("Error fetching chat history:", err);
    throw err;
  }
}
