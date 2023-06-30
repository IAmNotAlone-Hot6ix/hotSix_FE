import axios from "axios";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./Card";
import { JsonConfig } from "../API/AxiosModule";

interface DecodedToken {
  id: string;
}

interface PostType {
  nickname: string;
  imgPath: string;
  gender: number;
  region: string;
  createdAt: string;
  content: string;
  commentCount: number;
  postId: number;
  postImgPath: string;
  like: boolean;
}

const MyPostList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState(0);
  const [postList, setPostList] = useState<PostType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastPostId, setLastPostId] = useState(0);

  const limit = 5;
  const target = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    const decodeToken = jwtDecode<DecodedToken>(accessToken);

    if (decodeToken.id) {
      console.log(Number(decodeToken.id));
      setUserId(Number(decodeToken.id));
    }
  }, [accessToken]);

  const getFirstPage = useCallback(async () => {
    try {
      const response = await JsonConfig("get", `api/post/basic/${userId}`);
      const datas = response.data.data;
      if (datas.length !== limit) {
        setMore(false);
      }
      setLastPostId(datas[datas.length - 1].postId);
      setPostList([...datas]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  const loadMore = useCallback(async () => {
    if (!lastPostId) return;
    try {
      const response = await JsonConfig("get", `api/post/${userId}`, null, {
        lastPostId,
        size: limit,
      });
      const datas = response.data.data;
      if (datas.length !== limit) {
        setMore(false);
      }
      setLastPostId(datas[datas.length - 1].postId);
      setPostList((prev) => {
        if (prev === null) return null;
        return [...prev, ...datas];
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [lastPostId, userId]);

  const onIntersect = useCallback(
    async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      console.log(entry);
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        await loadMore();
      }
    },
    [loadMore]
  );

  useEffect(() => {
    if (!userId) return;
    setMore(true);
    setPostList(null);
    (async () => {
      await getFirstPage();
      window.scrollTo({ top: 0, behavior: "auto" });
    })();
  }, [getFirstPage, setPostList, userId]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (target.current) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 1,
      });
      if (isLoading) {
        observer.unobserve(target.current);
      } else {
        observer.observe(target.current);
      }
    }

    return () => {
      setIsLoading(false);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [onIntersect, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full pb-14">
      <h3 className="flex items-center justify-center w-full h-12 border-b-2 border-main-400 text-main-400 text-md">게시물</h3>
      <div className="flex flex-col items-center p-4 gap-4 w-full">
        {postList !== null && postList.length
          ? postList.map((post) => {
              return <Card post={post} key={post.postId} />;
            })
          : "작성한 게시물이 없습니다."}
      </div>
      {more && (
        <div className="p-4">
          <div ref={target}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default MyPostList;
