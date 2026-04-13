import QuizResult from "../models/quizResult.model.js";
import Perfume from "../models/product.model.js";
import User from "../models/user.model.js";

const generateTagsFromAnswers = (answers) => {
  const tagScores = {};
  const bump = (tag, pts) => { tagScores[tag] = (tagScores[tag] || 0) + pts; };

  answers.forEach((ans) => {
    const text = ans.selectedOption.toLowerCase();

    // Q1: Ideal vibe
    if (text.includes("romantic"))    bump("floral", 2);
    if (text.includes("office"))      bump("fresh",  2);
    if (text.includes("party"))       bump("sweet",  2);
    if (text.includes("casual"))      bump("woody",  1);

    // Q2: Personality trait
    if (text.includes("bold"))        bump("spicy",  3);
    if (text.includes("calm"))        bump("woody",  2);
    if (text.includes("energetic"))   bump("fresh",  2);
    if (text.includes("elegant"))     bump("floral", 2);

    // Q3: Preferred environment
    if (text.includes("indoor"))      bump("sweet",  1);
    if (text.includes("outdoor"))     bump("fresh",  2);
    if (text.includes("luxury"))      bump("floral", 2);
    if (text.includes("nature"))      bump("woody",  2);

    // Q4: Mood
    if (text.includes("relaxed"))     bump("woody",  1);
    if (text.includes("adventurous")) bump("spicy",  2);
    if (text.includes("chill"))       bump("fresh",  1);
    if (text.includes("confident"))   bump("floral", 2);

    // Q5: Direct scent type
    if (text.includes("sweet"))       bump("sweet",  3);
    if (text.includes("woody"))       bump("woody",  3);
    if (text.includes("fresh"))       bump("fresh",  3);
    if (text.includes("spicy"))       bump("spicy",  3);
  });

  return Object.entries(tagScores)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag); // e.g. ["fresh", "floral", "spicy"]
};

// ─── Shared matching helper ───────────────────────────────────────────────────
async function getMatchedPerfumes(generatedTags, limit) {
  // Primary: exact match (both sides are now lowercase ✅)
  let perfumes = await Perfume.aggregate([
    {
      $match: {
        stock: { $gt: 0 },
        tags: { $in: generatedTags },
      },
    },
    {
      $addFields: {
        matchCount: {
          $size: {
            $ifNull: [{ $setIntersection: ["$tags", generatedTags] }, []],
          },
        },
      },
    },
    { $sort: { matchCount: -1, createdAt: -1 } },
    { $limit: limit },
  ]);

  // Fallback: newest in-stock (tags not set on any perfume yet)
  if (perfumes.length === 0) {
    console.warn("⚠️ No tag matches — returning newest in-stock perfumes as fallback");
    perfumes = await Perfume.find({ stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  return perfumes;
}

// ─── POST /quiz/recommend ─────────────────────────────────────────────────────
export const submitQuizAndRecommend = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user._id;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const generatedTags = generateTagsFromAnswers(answers);

    let quizResult = await QuizResult.findOne({ user: userId });
    if (quizResult) {
      quizResult.answers = answers;
      quizResult.generatedTags = generatedTags;
      await quizResult.save();
    } else {
      quizResult = await QuizResult.create({ user: userId, answers, generatedTags });
    }

    await User.findByIdAndUpdate(userId, { personalityTags: generatedTags, quizCompleted: true });

    const recommendedPerfumes = await getMatchedPerfumes(generatedTags, 5);

    return res.status(201).json({
      message: "Quiz submitted successfully",
      generatedTags,
      recommendations: recommendedPerfumes,
      quizResult,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── GET /quiz/recommendations ────────────────────────────────────────────────
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    // log("Fetching recommendations for user:", userId);

    const user = await User.findById(userId);
    let generatedTags = user?.personalityTags || [];

    if (generatedTags.length === 0) {
      const qr = await QuizResult.findOne({ user: userId });
      generatedTags = qr?.generatedTags || [];
    }

    if (generatedTags.length === 0) {
      return res.status(200).json({
        message: "No recommendations available. Please take the quiz first.",
        recommendations: [],
        generatedTags: [],
      });
    }

    const recommendedPerfumes = await getMatchedPerfumes(generatedTags, 10);

    return res.status(200).json({
      recommendations: recommendedPerfumes,
      generatedTags,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};