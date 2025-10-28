import React, { useState } from "react";
import YouTube from "react-youtube";
import nlp from "compromise"; // 👈 local emotion analyzer

const App = () => {
  const [mood, setMood] = useState("happy");
  const [language, setLanguage] = useState("tamil");
  const [prompt, setPrompt] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const YOUTUBE_API_KEY = "AIzaSyBWf1VlPHgdD3eJ6zaKGH4ReP79wnLBMD4"; // 🔑 your API key

  // 🎨 Background colors per mood
  const moodColors = {
    happy: "bg-gradient-to-br from-yellow-300 to-pink-300",
    sad: "bg-gradient-to-br from-blue-400 to-indigo-500",
    energetic: "bg-gradient-to-br from-red-400 to-orange-400",
    relaxed: "bg-gradient-to-br from-green-300 to-teal-400",
  };

  // 🧠 Simple emotion analyzer (dictionary-based)
  const emotionKeywords = {
    happy: ["happy", "joy", "excited", "love", "smile", "positive", "cheerful"],
    sad: ["sad", "cry", "breakup", "lonely", "depressed", "heartbroken", "miss"],
    energetic: ["energy", "dance", "party", "workout", "active", "motivated"],
    relaxed: ["calm", "peace", "relax", "chill", "soothing", "quiet", "meditate"],
  };

  const analyzeEmotion = (text) => {
    const doc = nlp(text.toLowerCase());
    const words = doc.terms().out("array");
    const scores = { happy: 0, sad: 0, energetic: 0, relaxed: 0 };

    words.forEach((word) => {
      for (const mood in emotionKeywords) {
        if (emotionKeywords[mood].includes(word)) {
          scores[mood]++;
        }
      }
    });

    const detectedMood = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    return detectedMood;
  };

  // 🎵 Fetch YouTube videos for mood or prompt
  const fetchYouTubeSongs = async (customPrompt, detectedMood = mood) => {
    setLoading(true);
    setVideos([]);

    try {
      const query = customPrompt
        ? `${language} ${customPrompt} songs`
        : `${language} ${detectedMood} songs playlist`;

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );

      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setVideos(data.items);
      } else {
        alert("No songs found. Try a different mood or prompt!");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      alert("Failed to fetch songs. Please try again later.");
    }

    setLoading(false);
  };

  // 🎭 Handle Mood Button Click
  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
    fetchYouTubeSongs("", selectedMood);
  };

  // 💬 Handle Prompt Search + Emotion Analysis
  const handlePromptSearch = () => {
    if (!prompt.trim()) {
      alert("Please describe how you feel!");
      return;
    }

    const detectedMood = analyzeEmotion(prompt);
    setMood(detectedMood);

    console.log("Detected Mood:", detectedMood);
    fetchYouTubeSongs(prompt, detectedMood);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-gray-900 transition-all duration-700 ${moodColors[mood]}`}
    >
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg text-center">
        🎧 Emotion AI Music Recommender
      </h1>

      {/* 🌐 Language Selector */}
      <div className="mt-4">
        <label className="text-lg font-semibold mr-2">Choose Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg shadow bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="tamil">Tamil 🎶</option>
          <option value="hindi">Hindi 🎵</option>
          <option value="english">English 🎧</option>
        </select>
      </div>

      {/* 🎭 Mood Buttons */}
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        {["happy", "sad", "energetic", "relaxed"].map((m) => (
          <button
            key={m}
            onClick={() => handleMoodClick(m)}
            className={`px-4 py-2 rounded-lg shadow text-white font-semibold transition ${
              mood === m ? "bg-indigo-600" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* 💬 Prompt Input */}
      <div className="mt-6 w-80 text-center">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how you feel... (e.g., Tamil sad song after breakup but want something positive)"
          className="w-full p-3 rounded-lg shadow focus:ring-2 focus:ring-indigo-400"
          rows="3"
        />
        <button
          onClick={handlePromptSearch}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
        >
          {loading ? "Finding Songs..." : "Analyze & Play 🎶"}
        </button>
      </div>

      {/* 🎥 YouTube Songs Display */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {loading && <p className="text-lg animate-pulse">Loading songs...</p>}

        {!loading &&
          videos.map((video) => (
            <div
              key={video.id.videoId}
              className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="text-md font-semibold text-center mb-2">
                {video.snippet.title}
              </h3>
              <YouTube
                videoId={video.id.videoId}
                opts={{
                  height: "200",
                  width: "300",
                  playerVars: { autoplay: 0 },
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
