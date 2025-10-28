import React from "react";

const moods = [
  { label: "😊 Happy", value: "happy", color: "bg-yellow-400" },
  { label: "😢 Sad", value: "sad", color: "bg-blue-500" },
  { label: "😌 Calm", value: "calm", color: "bg-teal-400" },
  { label: "💪 Energetic", value: "energetic", color: "bg-red-500" },
];

const MoodSelector = ({ onMoodSelect }) => {
  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select Your Mood 🎧
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodSelect(mood.value)}
            className={`px-5 py-3 rounded-xl text-white font-medium shadow-md hover:scale-105 transition ${mood.color}`}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
