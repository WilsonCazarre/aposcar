import React from "react";
import RoomItem from "./RoomItem";
import { Room } from "../../utils/apiEntities";
import CardItem from "../CardItem";
import { StarIcon } from "@heroicons/react/outline";

interface Props {
  rooms?: Room[];
  setNewRoom: (room: Room | undefined) => void;
}

const RoomsList: React.FC<Props> = ({ rooms, setNewRoom }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4">
        {"You don't have any rooms, try to join or create one :)"}
      </div>
    );
  }

  return (
    <>
      <CardItem>
        <div className="flex items-center space-x-3">
          <button
            className="text-2xl truncate"
            onClick={() => setNewRoom(undefined)}
          >
            Aposcar Global
          </button>
        </div>
      </CardItem>
      {rooms.map((room) => (
        <RoomItem key={room.id} room={room} onClick={() => setNewRoom(room)} />
      ))}
    </>
  );
};

export default RoomsList;
