import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from 'react-google-login';
import styled, { keyframes, css } from 'styled-components';
import './index.css';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #14141B;
`;

const Button = styled.button`
  margin: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #282c34;
  color: white;
  border: none;
  border-radius: 5px;
  animation: ${fadeIn} 0.5s forwards;
  &:hover {
    background-color: #3a3f47;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();

//   const handleLoginSuccess = (response) => {
//     console.log('Login Success:', response.profileObj);
//     // 로그인 성공 후의 로직을 여기에 추가
//   };

//   const handleLoginFailure = (response) => {
//     console.log('Login Failed:', response);
//   };

  return (
    <Container>
      <Button onClick={() => navigate('/picture-throw')}>Go to Picture Throw</Button>
      <Button>
            Login with Google
      </Button>
      {/* <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        render={renderProps => (
          <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Login with Google
          </Button>
        )}
      /> */}
    </Container>
  );
};

export default LoginPage;
