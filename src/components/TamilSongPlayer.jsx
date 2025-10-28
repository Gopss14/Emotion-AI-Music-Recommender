import React from "react";
import YouTube from "react-youtube";

const TamilSongPlayer = ({ videoId }) => {
  const opts = {
    height: "300",
    width: "480",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="flex justify-center my-4">
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};

export default TamilSongPlayer;
