import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../Style/quiz.css";

const questions = [
  {
    question: "Your ideal vibe?",
    options: ["Romantic", "Office", "Party", "Casual"],
  },
  {
    question: "Pick a personality trait",
    options: ["Bold", "Calm", "Energetic", "Elegant"],
  },
  {
    question: "Preferred environment?",
    options: ["Indoor", "Outdoor", "Luxury", "Nature"],
  },
  {
    question: "Choose a mood",
    options: ["Relaxed", "Adventurous", "Chill", "Confident"],
  },
  {
    question: "Pick a scent type",
    options: ["Sweet", "Woody", "Fresh", "Spicy"],
  },
];

const QuizPage = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQ] = {
      question: questions[currentQ].question,
      selectedOption: option,
    };
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (!answers[currentQ]) {
      alert("Please select an option");
      return;
    }
    setCurrentQ(currentQ + 1);
  };

  const prevQuestion = () => {
    setCurrentQ(currentQ - 1);
  };

  const handleSubmit = async () => {
    // ✅ FIX #3: Validate last answer before submitting
    if (!answers[currentQ]) {
      alert("Please select an option");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post("/quiz/recommend", { answers });

      // ✅ FIX #4: Removed dead localStorage.setItem — Recommendations page fetches from API directly
      navigate("/recommendations");
    } catch (err) {
      console.error("Quiz submit error:", err);
      const msg = err.response?.data?.message || err.message || "Error submitting quiz";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      <div className="aroma-quiz quiz-bg flex items-center justify-center min-h-screen px-4 relative">
        <div className="noise-overlay" />

        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
           borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.04)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
           borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none",
        }} />

        <div className="relative z-10 w-full md:max-w-130 max-w-100" style={{padding:"0 15px"}}>

          {/* Brand */}
          <div className="text-center mb-8 fade-in">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "26px", fontWeight: 300,
                marginTop: "10px",
                letterSpacing: "0.45em", color: "#c9a84c", display: "block",
              }}>FRAGY</span>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: "9px",
                fontWeight: 300, letterSpacing: "0.55em",
                color: "rgba(255,255,255,0.22)", display: "block",
                marginTop: "3px", textTransform: "uppercase",
              }}>Maison de Parfum</span>
            </Link>
          </div>

          {/* Card */}
          <div className="quiz-card px-8 py-10 fade-in">
            <div className="corner-tl" /><div className="corner-br" />

            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                  <div style={{ height: "1px", width: "24px", background: "rgba(201,168,76,0.5)" }} />
                  <span style={{
                    fontFamily: "'Jost', sans-serif", fontSize: "9px",
                    fontWeight: 400, letterSpacing: "0.45em",
                    color: "rgba(201,168,76,0.55)", textTransform: "uppercase",
                  }}>Scent Profile</span>
                </div>
                <p style={{
                  fontFamily: "'Jost', sans-serif", fontSize: "10.5px",
                  fontWeight: 300, letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.22)", textTransform: "uppercase",
                  margin: 0,
                }}>
                  Question {currentQ + 1} of {questions.length}
                </p>
              </div>

              {/* Step pips */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {questions.map((_, i) => (
                  <div key={i} className="step-pip" style={{
                    background: i < currentQ
                      ? "#c9a84c"
                      : i === currentQ
                      ? "rgba(201,168,76,0.7)"
                      : "rgba(255,255,255,0.1)",
                    width: i === currentQ ? "18px" : "6px",
                    borderRadius: i === currentQ ? "3px" : "50%",
                  }} />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-dot" style={{ left: `${progress}%` }} />
            </div>

            {/* Question */}
            <h2 key={currentQ} className="fade-in" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "30px", fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.02em", lineHeight: 1.15,
              marginBottom: "28px",
            }}>
              {questions[currentQ].question}
            </h2>

            {/* Options */}
            <div key={`opts-${currentQ}`} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`quiz-option fade-in ${answers[currentQ]?.selectedOption === opt ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="option-bullet">
                    <div className="option-check" />
                  </div>
                  {opt}
                </button>
              ))}
            </div>

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={prevQuestion}
                disabled={currentQ === 0}
                className="btn-back"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Back
              </button>

              {currentQ === questions.length - 1 ? (
                <button onClick={handleSubmit} disabled={submitting} className="btn-submit">
                  <span>
                    {submitting ? "Discovering..." : "Discover My Scent"}
                    {!submitting && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    )}
                  </span>
                </button>
              ) : (
                <button onClick={nextQuestion} className="btn-next">
                  Next
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: "center", fontFamily: "'Jost', sans-serif",
            fontSize: "10px", fontWeight: 300, letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.12)", margin: "29px 0",
          }}>
            © FRAGY — Maison de Parfum. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default QuizPage;