import React, { useState } from "react";
import { User } from "../../utils/apiEntities";
import ScoreBar from "../rooms/ScoreBar";
import ProfilePicture from "../profile/ProfilePicture";
import CardItem from "../CardItem";
import ProfileModal from "../profile/ProfileModal";

interface Props {
  user: User;
  userIdx: number;
}

const ScoreboardItem: React.FC<Props> = ({ user, userIdx }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <CardItem className="flex items-center h-20 bg-gray-800">
      <span className="text-3xl">{userIdx + 1}</span>
      <span
        className="mx-4 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <ProfilePicture />
      </span>

      <div className="flex-grow">
        <span className="flex justify-between items-center">
          <span className="font-bold text-xl">{user.username}</span>
          <span>{user.score} points</span>
        </span>
        <ScoreBar score={user.score} />
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(!isModalOpen)}
        user={user}
      />
    </CardItem>
  );
};

export default ScoreboardItem;
