import BoardCard from "../components/Main/BoardCard";
import { useEffect, useState } from "react";
import SearchCard from "../components/Main/SearchCard";
import Footer from "../components/Main/Footer";
import { FaPencilAlt } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { RxTriangleDown } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostToolButtons from "../components/common/PostToolButtons";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchList, setSearchList] = useState([]);
  const backToMainPage = () => {
    navigate("/");
  };
  const [showPostButtons, setShowPostButtons] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/postProjectionMainDtoList`)
      .then((response) => {
        setSearchList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchList]);
  return (
    <>
      <div className="min-h-690">
        <div className="bg-indigo-50">
          <section className="flex justify-center items-center pt-6 ">
            <div onClick={backToMainPage}>
              <FiArrowLeft className="mr-4" />
            </div>
            <div className="flex">
              <button className=" rounded-none rounded-tl-lg rounded-bl-lg p-1 bg-white text-sm">제목 </button>
              <div className="border-r">
                <RxTriangleDown className="h-full text-2xl cursor-pointer bg-white text-blue-100" />
              </div>
              <input placeholder=" 검색" className="w-3/5" />
              <button className="rounded-none rounded-tr-lg rounded-br-lg p-1  bg-indigo-400 text-sm">확인</button>
            </div>
          </section>

          <SearchCard />
          {/* {searchList?.map((b, i) => {
            return (
              <div key={i}>
                <BoardCard board={b} setShowPostButtons={setShowPostButtons} />;
              </div>
            );
          })} */}

          <div className="flex justify-end mb-14 pt-1 pb-6 mr-5">
            <div className="fixed bottom-20 right-5 flex justify-center items-center w-12 h-12 bg-indigo-300 rounded-full">
              <FaPencilAlt className="cursor-pointer text-2xl" />
            </div>
          </div>
        </div>
      </div>
      <Footer selected={false} />
      {showPostButtons && <PostToolButtons handleShow={() => setShowPostButtons(false)} />}
    </>
  );
};

export default SearchPage;
