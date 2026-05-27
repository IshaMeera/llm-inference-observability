"use client";

import { useState, useEffect } from "react";
import { sendMessage, streamMessage } from "../services/api";
import ReactMarkdown from "react-markdown";
import { getChatHistory } from "../services/api.js";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [controller, setController] = useState(null);

  useEffect(() => {
    console.log("Session effect");
    const existing = localStorage.getItem("sessionId");
    if(existing){
      setSessionId(existing);
    }else{
      const id = crypto.randomUUID();
      localStorage.setItem("sessionId", id);
      setSessionId(id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  useEffect(() => {
    console.log("load effect");
    if(!sessionId) return;
    async function load(){
      console.log("Calling api");
      try{
        const history = await getChatHistory(sessionId);
        console.log("LOaded history", history);
        const restored = (history || []).map(m=>({role: m.role, text: m.content}));
        console.log("Restored", restored);
        setMessages(restored);
      }catch(err){
        console.error("Failed to load chat history:", err);
      }
    }
    load();
  }, [sessionId]);

  async function handleSend() {
    if (!message.trim() || loading || !sessionId) return;

    const userText = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
      },
      {
        role: "assistant",
        text: "",
      }
    ]);

    setMessage("");
    setLoading(true);

   try {
        const abortController = new AbortController();
        setController(abortController);
        await streamMessage(
          userText,
          sessionId,

          (chunk) => {
            setMessages((prev) => {

              const updated = [...prev];

              updated[
                updated.length - 1
              ].text = chunk;

              return updated;

            });
          },
          abortController.signal
        );

      } catch (error) {

        console.log(
          "Streaming err",
          error
        );

        setMessages((prev) => {

          const updated = [...prev];

          updated[
            updated.length - 1
          ].text =
            "Something went wrong. Please try again.";

          return updated;

        });

      } finally {

        setLoading(false);

      }
    }

  function handleCancel(){
    if(!controller) return;
    controller.abort();
    setLoading(false);
    setController(null);
  }

  function handleKeyDown(e) {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasMessages =
    messages.length > 0;

  return (
    <div className="h-screen bg-[#212121] text-white">

      {/* EMPTY STATE */}

      {!hasMessages ? (

        <div className="h-full flex flex-col items-center justify-center">

          <h1 className="text-4xl font-semibold mb-10">
            AI Risk Assistant
          </h1>

          <div className="w-full max-w-3xl px-4">

            <div className="flex items-center bg-[#303030] rounded-3xl px-5 py-4">

              <input
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Ask anything..."

                className="
                flex-1
                bg-transparent
                outline-none
                text-white
                "
              />
              {loading ? (

                <button
                  onClick={
                    handleCancel
                  }
                className="
                bg-red-500
                text-white
                px-5
                py-2
                rounded-full
                "
              >
                Stop
              </button>
              ) : (
              <button
                onClick={
                  handleSend
                }

                className="
                ml-4
                bg-white
                text-black
                px-5
                py-2
                rounded-full
                "
              >
                Send
              </button>
              )}
            </div>

          </div>

        </div>

      ) : (

        /* CHAT MODE */

        <div className="h-full flex flex-col">

          <div className="flex-1 overflow-y-auto">

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

              {messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={
                      msg.role ===
                      "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >

                    <div
                      className={`max-w-[80%] rounded-3xl px-5 py-4 leading-7

                      ${
                        msg.role ===
                        "user"
                          ? "bg-[#2f2f2f]"
                          : "bg-[#303030]"
                      }`}
                    >

                      <div className="prose prose-invert max-w-none prose-p:my-2 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-strong:text-white">
                        <ReactMarkdown>
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                    </div>

                  </div>

                )
              )}

              {loading && (

                <div className="text-neutral-400">

                  Thinking...

                </div>

              )}

            </div>

          </div>

          <div className="border-t border-neutral-800 p-5">

            <div className="max-w-3xl mx-auto">

              <div className="flex items-center bg-[#303030] rounded-3xl px-5 py-4">

                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }

                  onKeyDown={
                    handleKeyDown
                  }

                  placeholder="Message AI Risk Assistant"

                  className="
                  flex-1
                  bg-transparent
                  outline-none
                  "
                />

                {loading ? (

                <button
                onClick={
                handleCancel
                }

                className="
                bg-red-500
                text-white
                px-5
                py-2
                rounded-full
                "
                >

                Stop

                </button>

                ) : (

                <button
                onClick={
                handleSend
                }

                className="
                bg-white
                text-black
                px-5
                py-2
                rounded-full
                "
                >

                Send

                </button>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}