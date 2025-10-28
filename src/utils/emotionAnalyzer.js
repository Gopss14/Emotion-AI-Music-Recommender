import nlp from "compromise";

const emotionKeywords = {
  happy: ["happy", "joy", "excited", "fun", "love", "smile", "positive"],
  sad: ["sad", "cry", "breakup", "lonely", "depressed", "heartbroken"],
  energetic: ["energy", "dance", "party", "workout", "strong", "active"],
  relaxed: ["calm", "peace", "relax", "chill", "soothing", "quiet"]
};

export function analyzeEmotion(prompt) {
  const doc = nlp(prompt.toLowerCase());
  const words = doc.terms().out("array");

  let moodScores = {
    happy: 0,
    sad: 0,
    energetic: 0,
    relaxed: 0,
  };

  words.forEach(word => {
    for (let mood in emotionKeywords) {
      if (emotionKeywords[mood].includes(word)) {
        moodScores[mood] += 1;
      }
    }
  });

  // get the mood with max score
  let detectedMood = Object.keys(moodScores).reduce((a, b) =>
    moodScores[a] > moodScores[b] ? a : b
  );

  return detectedMood;
}
