import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

var google = 0;
var Image_list = [];
var Image_list1 = [];
Image_list = [
    '/glass.jpg', 
    '/picture1.jpg',
    '/picture2.jpg',
    '/picture3.jpg',
    '/picture4.jpg',
    '/picture5.jpg',
    '/picture6.jpg',
    '/picture7.jpg',
    '/picture8.jpg',
    '/picture9.jpg',
    '/1.jpeg',
    '/2.png',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
    '/7.jpeg',
    '/8.png',
    '/9.jpeg',
    '/10.jpeg',
    '/11.jpeg',
    '/12.jpeg',
    '/13.jpeg',
    '/14.jpeg',
    '/15.jpeg'

];

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');

      if (accessToken) {
        try {
          const response = await fetch(`http://localhost:8888/login/photo`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const data = await response.json();
          Image_list1 = data;
          console.log("Image_list1:", Image_list1);
          navigate('/random-photo');  // 데이터를 가져온 후 페이지를 이동
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      }
    };

    fetchPhotos();
  }, [navigate]);

  const handleExploreClick = () => {
    google = 0;
    navigate('/random-photo');
  };

  const handleExploreClick1 = () => {
    google = 1;
    console.log("google login:",google);
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=352230928390-nv787d0c6kvjsutltupkke6b1tkclc9o.apps.googleusercontent.com`;
    url += `&redirect_uri=http://localhost:8888/login/redirect`;
    url += '&response_type=code';
    // Add Google Photos API scope
    url += '&scope=email profile https://www.googleapis.com/auth/photoslibrary.readonly openid';
    url += '&access_type=online';

    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="button-wrapper">
        <button className="explore-button" onClick={handleExploreClick}>
          Explore Swan’s & Won’s Photos
        </button>
        <button className="google-button" onClick={handleExploreClick1}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8eb075904f188f378606dd3d0f74bad85e1d8b595fb67e8af9553d543e5e9832?"
            alt="Google icon"
            className="google-icon"
          />
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
};

export default Login;
export { Image_list, Image_list1, google };


// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// var Image_list = [];
// var Image_list1 = [];
// Image_list = [
//     '/glass.jpg', 
//     '/picture1.jpg',
//     '/picture2.jpg',
//     '/picture3.jpg',
//     '/picture4.jpg',
//     '/picture5.jpg',
//     '/picture6.jpg',
//     '/picture7.jpg',
//     '/picture8.jpg',
//     '/picture9.jpg',
//     '/IMG_5300.JPG',
//     '/IMG_5301.JPG',
//     '/glass.jpg', 
//     '/picture1.jpg',
//     '/picture2.jpg',
//     '/picture3.jpg',
//     '/picture4.jpg',
//     '/picture5.jpg',
//     '/picture6.jpg',
//     '/picture7.jpg',
//     '/picture8.jpg',
//     '/picture9.jpg',
//     '/IMG_5300.JPG',
//     '/IMG_5301.JPG',
//     '/glass.jpg', 
//     '/picture1.jpg',
//     '/picture2.jpg',
//     '/picture3.jpg',
//     '/picture4.jpg',
//     '/picture5.jpg',
//     '/picture6.jpg',
//     '/picture7.jpg',
//     '/picture8.jpg',
//     '/picture9.jpg',
//     '/IMG_5300.JPG',
//     '/IMG_5301.JPG',
//     '/glass.jpg', 
//     '/picture1.jpg',
//     '/picture2.jpg',
//     '/picture3.jpg',
//     '/picture4.jpg',
//     '/picture5.jpg',
//     '/picture6.jpg',
//     '/picture7.jpg',
//     '/picture8.jpg',
//     '/picture9.jpg',
//     '/IMG_5300.JPG',
//     '/IMG_5301.JPG',
// ];

// const Login = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPhotos = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');

//       if (code) {
//         try {
//           const response = await fetch(`http://localhost:8888/login/redirect?code=${code}`);
//           const data = await response.json();
//           Image_list1 = data;
//           console.log("Image_list1:", Image_list1);
//           navigate('/random-photo');  // 데이터를 가져온 후 페이지를 이동
//         } catch (error) {
//           console.error('Error fetching photos:', error);
//         }
//       }
//     };

//     fetchPhotos();
//   }, [navigate]);

//   const handleExploreClick = () => {
//     navigate('/random-photo');
//   };

//   const handleExploreClick1 = () => {
//     let url = "https://accounts.google.com/o/oauth2/v2/auth";
//     url += `?client_id=352230928390-nv787d0c6kvjsutltupkke6b1tkclc9o.apps.googleusercontent.com`;
//     url += `&redirect_uri=http://localhost:8888/login/redirect`;
//     url += '&response_type=code';
//     // Add Google Photos API scope
//     url += '&scope=email profile https://www.googleapis.com/auth/photoslibrary.readonly openid';
//     url += '&access_type=online';

//     window.location.href = url;
//   };

//   return (
//     <div className="login-container">
//       <div className="button-wrapper">
//         <button className="explore-button" onClick={handleExploreClick}>
//           Explore Swan’s & Won’s Photos
//         </button>
//         <button className="google-button" onClick={handleExploreClick1}>
//           <img 
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/8eb075904f188f378606dd3d0f74bad85e1d8b595fb67e8af9553d543e5e9832?"
//             alt="Google icon"
//             className="google-icon"
//           />
//           Google 계정으로 계속하기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;
// export { Image_list, Image_list1 };
