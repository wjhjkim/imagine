import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Transition } from 'react-transition-group';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import PictureThrow from './picture_throw';
import PictureThrowWaterColor from './picture_throw_watercolor';
import PictureThrowChangeColor from './picture_throw_changecolor';
import './index.css';
import LoginPage from './login_page';
import PictureThrowLine from './picture_throw_line';
import PictureThrowGoodLine from './picture_throw_goodline';
import PictureThrowGreatLine from './picture_throw_greatline';
import RandomPhoto from './random_photo';
import Mapbox from './Mapbox';
import WaterRipple from './WaterRipple';
import WaterFalling from './WaterFalling';
import Login from './login';
import YouTube from 'react-youtube';

const opts = {
    height: '0',
    width: '0',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady = (event) => {
    console.log("외안돼");
    // access to player in all event handlers via event.target
    event.target.playVideo();
  };

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: black;
  position: relative;
  overflow: hidden; /* Ensure no scrolling */
`;

const Video = styled.video`
  position: absolute;
  z-index: 1;
  width: 70%;
  height: auto;
  cursor: ${props => (props.videoEnded ? 'pointer' : 'default')};
  ${props =>
    props.fadeOutVideo &&
    css`
      animation: ${fadeOut} 0.6s forwards;
    `}
`;

const Landing = () => {
    const [showLogo, setShowLogo] = useState(true);
    const [videoEnded, setVideoEnded] = useState(false);
    const [fadeOutVideo, setFadeOutVideo] = useState(false);
    const navigate = useNavigate();
    const mainCanvasRef = useRef(null);
    const videoRef = useRef(null);
    const nodeRef = useRef(null);

    const fillCanvas = (canvas) => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const mainCtx = canvas.getContext('2d');
            mainCtx.fillStyle = 'black';
            mainCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        fillCanvas(canvas);

        const handleResize = () => {
            fillCanvas(canvas);
        };

        if (videoRef.current) {
            videoRef.current.playbackRate = 1.6; // 재생 속도를 1.6배로 설정
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogoClick = () => {
        setFadeOutVideo(true);
        setTimeout(() => setShowLogo(false), 500); // 2초 후에 setShowLogo(false) 호출
    };

    const onExited = () => {
        navigate('/login-page');
    };

    const handleVideoLoad = () => {
        console.log("Video loaded successfully");
    };

    const handleVideoError = () => {
        console.error("Error loading video");
    };

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

    const transitionStyles = {
      entering: { opacity: 0 },
      entered: { opacity: 1 },
      exiting: { opacity: 1 },
      exited: { opacity: 0 },
    };

    return (
        <Transition in={showLogo} timeout={2000} onExited={onExited} nodeRef={nodeRef}>
            {state => (
                <Background>
                    <canvas ref={mainCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}></canvas>
                    <Video
                        ref={nodeRef}
                        src="/videos/Imagine_logo2.mp4"
                        style={{
                            ...transitionStyles[state],
                        }}
                        fadeOutVideo={fadeOutVideo}
                        videoEnded={videoEnded}
                        onClick={videoEnded ? handleLogoClick : undefined} // 비디오가 끝난 후에만 클릭 가능
                        onLoadedData={handleVideoLoad}
                        onError={handleVideoError}
                        onEnded={handleVideoEnd}
                        autoPlay
                        muted
                    />
                </Background>
            )}
        </Transition>
    );
};

const Intro = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/picture-throw" element={<PictureThrow />} />
                <Route path="/picture-throw-watercolor" element={<PictureThrowWaterColor />} />
                <Route path="/picture-throw-changecolor" element={<PictureThrowChangeColor />} />
                <Route path="/picture-throw-line" element={<PictureThrowLine />} />
                <Route path="/picture-throw-goodline" element={<PictureThrowGoodLine />} />
                <Route path="/picture-throw-greatline" element={<PictureThrowGreatLine />} />
                <Route path="/login-page" element={<Login />} />
                <Route path="/random-photo" element={<RandomPhoto />} />

                <Route path="/mapbox" element={<Mapbox />} />
                <Route path="/waterripple" element={<WaterRipple />} />
                <Route path="/waterfalling" element={<WaterFalling />} />
            </Routes>
            <YouTube videoId="PLu2xtDrxt1SXU7hGJUqypKqNv2FRGLByM" opts={{
    height: '5',
    width: '5',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      start: 0,
      fs: 0,
      list: 'PLu2xtDrxt1SXU7hGJUqypKqNv2FRGLByM',
      listType: 'playlist',
    },
  }} onReady={(event) => {
    console.log("외안돼");
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }} onEnd={(e)=>{e.target.playVideo();}} />
            <div className="mapbox-frame">
                <Mapbox />
            </div>
        </Router>
    );
};

export default Intro;
