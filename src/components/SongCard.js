import React from "react";
import { motion } from "framer-motion";

const SongCard = ({ song }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl p-4 shadow-md w-64 transition-all duration-300 hover:shadow-lg"
    >
      <img
        src={song.album.cover_medium}
        alt={song.title}
        className="rounded-xl mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">{song.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{song.artist.name}</p>

      <audio
        controls
        src={song.preview}
        className="w-full mt-2 rounded-lg"
      ></audio>
    </motion.div>
  );
};

export default SongCard;
