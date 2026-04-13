import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },

    answers: [
      {
        question: String,
        selectedOption: String,
      },
    ],

    generatedTags: [String],
  },
  { timestamps: true }
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;