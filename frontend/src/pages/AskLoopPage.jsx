import { useState } from "react";
import axios from "axios";
import { Sparkles, Send } from "lucide-react";
import { API_URL } from "../api";

function AskLoopPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const token = localStorage.getItem("loop_token");

    try {
      setLoading(true);
      setAnswer("");

      const response = await axios.post(
        `${API_URL}/ai/ask`,
        {
          question: question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(response.data.answer);
      setQuestion("");
    } catch (error) {
      console.error("Ask LOOP error:", error);

      setAnswer(
        error.response?.data?.detail ||
          "Unable to analyze feedback right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
  };

  return (
    <section className="ask-loop-page">
      <div className="ask-loop-header">
        <div>
          <p className="eyebrow">AI ASSISTANT</p>

          <h1>Ask LOOP</h1>

          <p className="subtitle">
            Ask questions about your customer feedback.
          </p>
        </div>
      </div>

      <div className="ask-loop-container">
        <div className="ask-loop-hero">
          <div className="ask-loop-icon">
            <Sparkles size={26} />
          </div>

          <h2>What would you like to know?</h2>

          <p>
            LOOP analyzes your customer feedback and helps you
            understand sentiment, recurring themes and emerging issues.
          </p>
        </div>

        <div className="suggestion-grid">
          <button
            onClick={() =>
              handleSuggestion(
                "What are the main negative issues?"
              )
            }
          >
            What are the main negative issues?
          </button>

          <button
            onClick={() =>
              handleSuggestion(
                "What is the top feedback theme?"
              )
            }
          >
            What is the top feedback theme?
          </button>

          <button
            onClick={() =>
              handleSuggestion(
                "How much positive feedback do we have?"
              )
            }
          >
            How much positive feedback do we have?
          </button>
        </div>

        {answer && (
          <div className="loop-answer">
            <div className="loop-answer-title">
              <Sparkles size={17} />
              LOOP Insight
            </div>

            <p>{answer}</p>
          </div>
        )}

        <div className="ask-input">
          <input
            type="text"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask LOOP about your customers..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleAsk();
              }
            }}
          />

          <button
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? (
              <span>...</span>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AskLoopPage;