import { useState, useRef, useEffect } from "react";
import { client } from "@/config";
import styles from "./styles.module.css";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";

function ChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("chat");
  const [interviewStep, setInterviewStep] = useState("question");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [role, setRole] = useState("MERN Stack");
  const [difficulty, setDifficulty] = useState("Medium");

  const bottomRef = useRef(null);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim() && mode === "chat") return;

    const userMessage =
      mode === "chat" || interviewStep === "answer"
        ? { role: "user", content: input }
        : null;

    if (userMessage) {
      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");
    setLoading(true);

    try {
      let res;

      // ================= CHAT MODE =================
      if (mode === "chat") {
        res = await client.post("/api/chat", {
          message: input,
          mode: "chat",
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.reply },
        ]);
      }

      // ================= INTERVIEW MODE =================
      if (mode === "interview") {
        // STEP 1: Generate Question
        if (interviewStep === "question") {
          res = await client.post("/api/chat", {
            mode: "generate",
            role,
            difficulty,
          });

          setCurrentQuestion(res.data.reply);

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `### 🧠 Interview Question (${role} - ${difficulty})

${res.data.reply}

✍️ Type your answer below.`,
            },
          ]);

          setInterviewStep("answer");
        }

        // STEP 2: Evaluate Answer
        else {
          res = await client.post("/api/chat", {
            mode: "evaluate",
            question: currentQuestion,
            answer: input,
          });

          let raw = res.data.reply;

          // Clean markdown wrappers if model adds ```json
          raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = null;
          }

          if (parsed) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                evaluation: parsed,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: raw },
            ]);
          }

          setInterviewStep("question");
        }
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <button
        className={styles.backButton}
        onClick={() => router.push("/dashboard")}
      >
        Back
      </button>

      {/* Mode Switch */}
      <div className={styles.modeSwitch}>
        <button
          className={mode === "chat" ? styles.activeButton : ""}
          onClick={() => setMode("chat")}
        >
          Chat Mode
        </button>

        <button
          className={mode === "interview" ? styles.activeButton : ""}
          onClick={() => {
            setMode("interview");
            setInterviewStep("question");
            setMessages([]);
          }}
        >
          Interview Mode
        </button>
      </div>

      {/* Interview Controls */}
      {mode === "interview" && (
        <div className={styles.interviewControls}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>MERN Stack</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Java</option>
            <option>DSA</option>
            <option>HR</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      )}

      <div className={styles.chatContainer}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.welcomeMessage}>
              <h2>
                {mode === "chat"
                  ? "Welcome to Chat Assistant"
                  : "AI Interview Simulator"}
              </h2>
              <p>
                {mode === "chat"
                  ? "Ask anything about your resume and career."
                  : "Click Send to generate your first question "}
              </p>
            </div>
          </div>
        )}

        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.aiMessage
              }
            >
              {msg.evaluation ? (
                <div className={styles.evaluationCard}>
                  <h3>📊 Score: {msg.evaluation.score}/10</h3>

                  <div>
                    <strong>✅ Strengths:</strong>
                    <p>{msg.evaluation.strengths}</p>
                  </div>

                  <div>
                    <strong>⚠️ Weaknesses:</strong>
                    <p>{msg.evaluation.weaknesses}</p>
                  </div>

                  <div>
                    <strong>💡 Ideal Answer:</strong>
                    <p>
                      {typeof msg.evaluation.idealAnswer === "object"
                        ? JSON.stringify(
                            msg.evaluation.idealAnswer,
                            null,
                            2
                          )
                        : msg.evaluation.idealAnswer}
                    </p>
                  </div>

                  <div>
                    <strong>🏁 Final Verdict:</strong>
                    <p>{msg.evaluation.finalVerdict}</p>
                  </div>
                </div>
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          ))}

          {loading && (
            <div className={styles.aiMessage}>Thinking...</div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder={
              mode === "chat"
                ? "Ask about resume or career..."
                : interviewStep === "answer"
                ? "Type your interview answer..."
                : "Press Send to generate question..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default ChatAssistant;
