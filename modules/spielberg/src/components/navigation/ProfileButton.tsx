import React, { useState } from "react";
import { ButtonProps } from "../Button";
import { User } from "../../utils/apiEntities";
import { UserIcon, XIcon } from "@heroicons/react/outline";
import BaseModal from "../modals/BaseModal";
import ProfileCard from "../profile/ProfileCard";
import ProfileModal from "../profile/ProfileModal";
import useAuth from "../../utils/useAuth";

interface Props extends Omit<ButtonProps, "color"> {
  user: User;
}

const ProfileButton: React.FC<Props> = ({ user, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loggedUser } = useAuth();
  return (
    <>
      <button
        className="flex items-center"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <UserIcon
          className="w-12 h-12 p-2 bg-gray-800
        text-gray-200 ring-yellow  rounded-full shadow-lg"
        />
      </button>
      <ProfileModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
        user={loggedUser as User}
      />
    </>
  );
};

export default ProfileButton;
