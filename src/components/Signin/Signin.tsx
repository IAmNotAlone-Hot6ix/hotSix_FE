import { useEffect, useState } from "react"
import { Link  } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { JsonConfig, createKakaoLoginConfig, createLoginConfig } from "../API/AxiosModule";
import {  getTokenExpiration, isTokenValid, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from "../API/TokenAction";




interface TokenResponse {
  accessToken:string
  refreshToken:string
  tokenCategory:string
}

const Signin = () => {
  const [email , setEmail] = useState<string>("")
  const [password , setPassword] = useState<string>("")
  const navigate = useNavigate();
  const redirect_uri = 'http://localhost:5173/signin';

  useEffect(() => {
    handleAuthorizationCode();
  }, []);

  const handleAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const Rest_api_key =localStorage.getItem("Rest_api_key")

    if (code && Rest_api_key) {
      createKakaoLoginConfig("POST","authorization_code",Rest_api_key,redirect_uri,code).then((response)=>{

        const accessToken = response.data["access_token"];
        const refreshToken = response.data["refresh_token"];

        const tokenResponse :TokenResponse ={
          accessToken:accessToken,
          refreshToken:refreshToken,
          tokenCategory:"kakao",
        }
        const accessTokenExpire = response.data["expires_in"];
        const refreshTokenExpire = response.data["refresh_token_expires_in"];

        handleTokenResponse(tokenResponse,accessTokenExpire,refreshTokenExpire);
        }).catch((error)=>{
          console.log("에러")
          console.error(error);
        });
    }
  };


  const defaultSignin = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeAccessToken();
    removeRefreshToken();
    const IDPW = {
      email: email,
      password: password,
    };
    // const params  = {id:1};
    // JsonConfig("delete" , "commentList" , null , params)
    // .then((res) => console.log(res));
    createLoginConfig("POST", "login",IDPW)
    .then((response) => {
      console.log(response)
      const accessToken = response.data["Authorization"];
      const refreshToken = response.data["Authorization-refresh"];

      const tokenResponse :TokenResponse ={
        accessToken:accessToken,
        refreshToken:refreshToken,
        tokenCategory:"default",
      }

      handleTokenResponse(tokenResponse);
    }) .catch((error) => {
      console.log("에러")
      console.error(error);
    });
  };

const kakaotalkSignIn =() =>{
    removeAccessToken();
    removeRefreshToken();
    localStorage.setItem("Rest_api_key",'ba688a75557d3918702599015fe8d999');
    const Rest_api_key =localStorage.getItem("Rest_api_key")
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    window.location.href = kakaoURL;
}

const handleTokenResponse = (tokenResponse:TokenResponse,accessTokenExpire:number=-1,refreshTokenExpire:number=-1) =>{

  if (tokenResponse.accessToken && tokenResponse.refreshToken) {
    setAccessToken(tokenResponse.accessToken); // 로컬스토리지에 액세스토큰 저장
    setRefreshToken(tokenResponse.refreshToken); // httponly 쿠키에 refresh 토큰 저장
    localStorage.setItem('tokenCategory',tokenResponse.tokenCategory);
    getTokenExpiration('accessToken',accessTokenExpire);
    getTokenExpiration('refreshToken',refreshTokenExpire);
    isTokenValid();
    navigate('/');//메인페이지로 이동
  }
}


  return (
    <div>
        <h1><a href="/"><img src="../../../public/logo.png" alt="" /></a></h1>
        <form action="">
          <div className="flex flex-col mt-5 items-center">
            <label htmlFor="input-email" className="w-9/12">이메일</label>
            <div className="flex w-9/12">
              <input type="email" id="input-email" className="w-4/5 h-10" value={email} onChange={(e)=>setEmail(e.target.value)} name="email"/>
            </div>
          </div>
          <div className="flex flex-col mt-5 items-center">
            <label htmlFor="input-password" className="w-9/12" >비밀번호</label>
            <input type="password" id="input-password" className="w-9/12 h-10" value={password} onChange={(e)=>setPassword(e.target.value)} name="password"/>
          </div>
          <button onClick={defaultSignin} type="submit" className=" flex items-center justify-center mx-auto rounded-none mt-4 w-9/12 h-12 bg-main-400 text-white">로그인</button>
          <div className="flex justify-end">
            <Link to={'/Signup'}>회원가입</Link>
          </div>
          <img src="../../public/kakao_login_large_wide.png" className=" w-full" onClick={kakaotalkSignIn} />
        </form>
    </div>
  )
}

export default Signin
