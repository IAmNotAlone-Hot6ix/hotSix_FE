import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostPage from "./pages/PostPage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import ChatRoomPage from "./pages/Chat/ChatRoomPage";
import ChatPage from "./pages/Chat/ChatListPage";
import AlarmPage from "./pages/Alarm/AlarmPage";
import SignUp from "./components/Singup/Singup";
import Signin from "./components/Signin/Signin";
import { QueryClient, QueryClientProvider } from "react-query";
import CartPage from "./pages/CartPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/post" element={<PostPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/detail" element={<DetailPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/ChatListPage" element={<ChatPage></ChatPage>}></Route>
        <Route path="/ChatRoom" element={<ChatRoomPage></ChatRoomPage>}></Route>
        <Route path="/AlarmPage" element={<AlarmPage></AlarmPage>}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
