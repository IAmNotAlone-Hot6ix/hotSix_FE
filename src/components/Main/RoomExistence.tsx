import React from "react";
import {
  isSelectedFindRoomAtom,
  isSelectedHasRoomAtom,
} from "../../pages/MainPage";
import { useAtom } from "jotai";

interface RoomExistProps {
  handleHasRoom: React.MouseEventHandler<HTMLButtonElement> &
    React.TouchEventHandler<HTMLButtonElement>;
  handleFindRoom: React.MouseEventHandler<HTMLButtonElement> &
    React.TouchEventHandler<HTMLButtonElement>;
}

const RoomExistence = ({ handleHasRoom, handleFindRoom }: RoomExistProps) => {
  const [isSelectedFindRoom, setIsSelectedFindRoom] = useAtom(
    isSelectedFindRoomAtom
  );
  const [isSelectedHasRoom, setIsSelectedHasRoom] = useAtom(
    isSelectedHasRoomAtom
  );
  return (
    <div className="flex justify-evenly mt-4">
      <button
        onClick={handleFindRoom}
        className={`px-9 py-2 rounded-full drop-shadow-xl  ${
          isSelectedFindRoom ? "bg-main-400 text-white" : " bg-white"
        }`}
      >
        방 구해요
      </button>
      <button
        onClick={handleHasRoom}
        className={`px-9 py-2 rounded-full drop-shadow-xl  ${
          isSelectedHasRoom ? "bg-main-400 text-white" : " bg-white"
        }`}
      >
        방 있어요
      </button>
    </div>
  );
};

export default RoomExistence;