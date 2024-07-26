import React, { useState, useEffect } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

import { Weather_1, Weather_2, Weather_3, Weather_4, Weather_5, Weather_6, Weather_7, Weather_8_9, Weather_10, Weather_11, Weather_12, Weather_13, Weather_14, Weather_15,Main_pg_se2_ill,Main_pg_se2_back,Main_pg_se2_button_img1,Main_pg_se2_button_img2,Main_pg_se2_button_img3,Main_pg_se3_img1,Main_pg_se3_img2,Main_pg_se3_img3 } from './Images';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import keys from '../../keys/keys';


function Main() {
    const [userName, setUserName] = useState('');
    const [weather, setWeather] = useState(null);
    const [date, setDate] = useState('');
    const [locationError, setLocationError] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const [weatherImage, setWeatherImage] = useState(null);
    const [weatherMain, setWeatherMain] = useState('');

    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const handleLinkClick = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        // 로컬 스토리지에서 현재 사용자 정보를 가져옴
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.name);
        }
      }, []);

    useEffect(() => {
        const fetchCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const locationName = await fetchLocationName(latitude, longitude);
                        await fetchWeather(latitude, longitude);
                        setCurrentLocation(locationName);
                    },
                    (error) => {
                        console.error('위치 정보를 가져오는 중 에러 발생:', error);
                        setLocationError(true);
                    }
                );
            } else {
                console.error('Geolocation을 지원하지 않습니다.');
                setLocationError(true);
            }
        };

        fetchCurrentLocation();

        // 현재 날짜 설정
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const weekDay = ['일', '월', '화', '수', '목', '금', '토'][currentDate.getDay()];

        setDate(`${month}월 ${day}일 ${weekDay}요일`);
    }, []);

    const fetchLocationName = async (latitude, longitude) => {
        const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `KakaoAK ${keys.kakaoApiKey}` // keys에서 가져온 kakaoApiKey 사용
                }
            });

            const address = response.data.documents[0]?.address?.region_1depth_name + ' ' +
                            response.data.documents[0]?.address?.region_2depth_name + ' ' +
                            response.data.documents[0]?.address?.region_3depth_name || '위치 정보를 찾을 수 없습니다.';
            return address;
        } catch (error) {
            console.error('위치 정보를 가져오는 중 에러 발생:', error);
            return '위치 정보를 가져오는 중 에러 발생';
        }
    };

    const fetchWeather = async (latitude, longitude) => {
        try {
            const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

            const response = await axios.get(apiUrl, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: keys.weatherApiKey, // keys에서 가져온 weatherApiKey 사용
                    units: 'metric'
                }
            });

            const temperature = response.data.main.temp;
            const weatherMain = response.data.weather[0].main; // 날씨 상태 가져오기

            setWeather(temperature);
            setWeatherMain(weatherMain); // 날씨 상태 설정

            // 날씨 이미지 설정
            setWeatherImage(getWeatherImage(weatherMain));
        } catch (error) {
            console.error('날씨 정보를 가져오는 중 에러 발생:', error);
            setWeather(null);
        }
    };


    const getWeatherImage = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return Weather_1;
            case 'Clouds':
                return Weather_2;
            case 'Drizzle':
                return Weather_3;
            case 'Rain':
                return Weather_4;
            case 'Thunderstorm':
                return Weather_5;
            case 'Snow':
                return Weather_6;
            case 'Mist':
                return Weather_7;
            case 'Smoke':
                return Weather_8_9;
            case 'Haze':
                return Weather_8_9;
            case 'Dust':
                return Weather_10;
            case 'Fog':
                return Weather_11;
            case 'Sand':
                return Weather_12;
            case 'Ash':
                return Weather_13;
            case 'Squall':
                return Weather_14;
            case 'Tornado':
                return Weather_15;
            default:
                return null;
        }
    };

    const getWeatherDescription = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return (
                    <>
                    ㆍ 테니스 치기 좋은 날씨네요 야외테니스를 즐겨보세요! 
                    </>
                );
            case 'Clouds':
                return (
                    <>
                     ㆍ 구름이 많네요 테린이분들은 이날이 최적이예요!
                    </>
                );
            case 'Drizzle':
                return (
                    <>
                      ㆍ 조금씩 비가 오니<br/>실내 테니스장에서 치기 좋은날이네요! 
                    </>
                );
            case 'Rain':
                return (
                    <>
                       ㆍ 비가 오니 실내 테니스장에서 즐겨보세요!
                    </>
                );
            case 'Thunderstorm':
                return (
                    <>
                       ㆍ 천둥번개가 치니 실내 테니스장에서 즐겨보세요!
                    </>
                );
            case 'Snow':
                return (
                    <>
                       ㆍ 차가운 겨울이네요.<br/>실내 테니스장에서 즐겨보세요!
                    </>
                );
            case 'Mist':
                return (
                    <>
                      ㆍ 안개가 조금씩 끼네요.<br/>실내 테니스장에서 즐겨보세요!
                    </>
                );
            case 'Smoke':
                return (
                    <>
                     ㆍ 연기가가 조금씩 나네요.<br/>조심하게 치세요!
                    </>
                );
            case 'Haze':
                return (
                    <>
                       ㆍ 실안개가 조금씩 있네요.<br/>조심하게 치세요!
                    </>
                );
            case 'Dust':
                return (
                    <>
                        ㆍ 황사가 조금씩 있네요.<br/>조심하게 치세요!
                    </>
                );
            case 'Fog':
                return (
                    <>
                    ㆍ 안개가 많이껴있네요.<br/>실내 테니스장에서 치는걸 추천드려요!
                    </>
                );
            case 'Sand':
                return (
                    <>
                    ㆍ 모래바람이 부네요.<br/>실내 테니스장에서 치는걸 추천드려요!
                    </>
                );
            case 'Ash':
                return (
                    <>
                        ㆍ 화산재가 오네요.<br/>다음에 테니스를 치는걸 추천드려요!
                    </>
                );
            case 'Squall':
                return (
                    <>
                        ㆍ 돌풍이 부네요.<br/>다음에 테니스를 치는걸 추천드려요!
                    </>
                );
            case 'Tornado':
                return (
                    <>
                        ㆍ 토네이도입니다!<br/>집으로 대피하세요!
                    </>
                );
            default:
                return '날씨 정보를 불러오는 중입니다';
        }
    };


    const handleReload = () => {
        window.location.reload();
      };

      const Go_All_Product = () => {
        navigate("/All_Product");
    }


    return (
        <div id="Main">
            <div id="main_warp">
                <div className="main_se1">
                    <div className="main_se1_warp">
                        <ul>
                            <li>
                                <Link 
                                    to={"../All_Court"} 
                                    className={activeIndex === 0 ? 'active' : ''} 
                                    onClick={() => handleLinkClick(0)}>
                                    코트 예약
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to={"../Account_Reservation"} 
                                    className={activeIndex === 1 ? 'active' : ''} 
                                    onClick={() => handleLinkClick(1)}>
                                    예약 내역
                                </Link>
                                </li>
                            <li> 
                                <Link 
                                    to={"../Match_MyInfo"} 
                                    className={activeIndex === 2 ? 'active' : ''} 
                                    onClick={() => handleLinkClick(2)}
                                >
                                    내 정보
                                </Link>
                            </li>
                        </ul>
                        <p>환영합니다. <span>{userName}님</span><br/>
                        Match point입니다.</p>
                    </div>
                </div>
                <div className="main_se2">
                    <div className="main_se2_warp">
                        {locationError ? (
                            <p>브라우저 설정에서 권한을 확인해주세요. 참고 <Link to={"https://www.google.com/search?q=%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80+%EC%9C%84%EC%B9%98%EC%A0%95%EB%B3%B4+%ED%97%88%EC%9A%A9&sca_esv=bb6fb22019ea88f6&biw=1920&bih=945&sxsrf=ADLYWIJ3rBo_4iJyq5159Ayvlh6Ps5KHkg%3A1719928227301&ei=owWEZqqNEt2ovr0PiamPqAU&ved=0ahUKEwjq6pv4v4iHAxVdlK8BHYnUA1U4ChDh1QMIDw&uact=5&oq=%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80+%EC%9C%84%EC%B9%98%EC%A0%95%EB%B3%B4+%ED%97%88%EC%9A%A9&gs_lp=Egxnd3Mtd2l6LXNlcnAiIOu4jOudvOyasOyggCDsnITsuZjsoJXrs7Qg7ZeI7JqpMgUQABiABDIIEAAYgAQYogQyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogRI6iNQqBlY2SFwBXgBkAEDmAHwAaABqQqqAQUwLjguMbgBA8gBAPgBAZgCCKACnwPCAgoQABiwAxjWBBhHwgIGEAAYBxgewgIIEAAYogQYiQXCAgcQABiABBgNmAMAiAYBkAYKkgcDNS4zoAeSIg&sclient=gws-wiz-serp"}/></p>
                        ) : (
                            <>
                                <div className="date_Warp"  Name="date_Warp" >
                                    <h3>오늘은 {date} </h3>
                                </div>
                                <div className="date_location">
                                    <span className="material-symbols-rounded reload" onClick={handleReload}>
                                    rotate_left
                                    </span>
                                    <div className="date_location_lt">
                                        {weatherImage && <img src={weatherImage} alt="날씨 이미지" />}        
                                    </div>
                                    <div className="date_location_rt">
                                    <h3><span>{currentLocation}</span>{weather !== null ? `${weather}°C` : '날씨 정보를 불러오는 중입니다.'}</h3>
                                    <p>{getWeatherDescription(weatherMain)}</p>
                                    </div>    
                                </div>
                            </>
                        )}
                          <div className="main_se2_button_wrap">
                            <Link to={"../All_court"}>
                                <img src={Main_pg_se2_button_img1} alt='Main_pg_se2_button_img1'/>
                                <p>코트 예약</p>
                            </Link>
                            <Link to={"../Account_Reservation"}>
                                <img src={Main_pg_se2_button_img2} alt='Main_pg_se2_button_img2'/>
                                <p>예약 내역</p>
                            </Link>
                            <Link to={"https://www.youtube.com/watch?v=GyISMO3Hs_Q&t=2s"} target='_blank'>
                                <img src={Main_pg_se2_button_img3} alt='Main_pg_se2_button_img3' title='유튜브에서 테니스 강의를 시청해보세요!'/>
                                <p>테니스 강의</p>
                            </Link>
                        </div>
                    </div>
                    <img src={Main_pg_se2_ill} alt='Main_pg_se2_ill' className='Main_pg_se2_ill'/>
                    <img src={Main_pg_se2_back} alt='Main_pg_se2_back' className='Main_pg_se2_back' />

                </div>
                <div className="main_se3">
                    <div className="main_se3_tx">
                        <h4>테니스 칠때 도움되는 제품들</h4>
                            <p onClick={Go_All_Product}>
                                더보기
                                <span className="material-symbols-rounded">
                                    arrow_forward_ios
                                </span>
                            </p>
                        
                    </div>
                    <div className="main_se3_slide">
                        <Swiper
                        modules={[Autoplay,]}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}                        
                        >
                        <SwiperSlide>
                            <Link to={"https://smartstore.naver.com/tyty1004/products/9810946799?NaPm=ct%3Dly6wct9c%7Cci%3D0321cb30366a56b6649480cdc0d288042c1156af%7Ctr%3Dsls%7Csn%3D438559%7Chk%3D5c8145a9d439fc9bece79077f284a586f5fcb979"} target='_blank'>
                              <div className="slide_box">
                                  <img src={Main_pg_se3_img1} alt="Slide 1" />
                                  <div className="slide_box_tx">
                                      <span className="material-symbols-rounded">
                                      prompt_suggestion
                                      </span>
                                      <p>요넥스 이존 EZONE 100</p>
                                  </div>
                              </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={"https://smartstore.naver.com/doorisports/products/10349739523?NaPm=ct%3Dly6vtprc%7Cci%3D443e1176a508e6ec9d2b069930becf09a97dd8f0%7Ctr%3Dsbfu%7Csn%3D572805%7Chk%3D1aeace3d80013a19a70ae9ee5c89090527c0b324"} target='_blank'>
                              <div className="slide_box">
                                  <img src={Main_pg_se3_img2} alt="Slide 2" />
                                  <div className="slide_box_tx">
                                      <span className="material-symbols-rounded">
                                      prompt_suggestion
                                      </span>
                                      <p>헤드 2024 스피드</p>
                                  </div>
                              </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={"https://smartstore.naver.com/hiaroundz/products/8975372821?NaPm=ct%3Dly6w28uw%7Cci%3D070abf7c2246f92ef5c379ade583c398a0f304cc%7Ctr%3Dsbfu%7Csn%3D7577337%7Chk%3D3374022343862b37f2fee2bce1f8b74d54a8eaf5"} target='_blank'>
                              <div className="slide_box">
                                  <img src={Main_pg_se3_img3} alt="Slide 3" />
                                  <div className="slide_box_tx">
                                      <span className="material-symbols-rounded">
                                      prompt_suggestion
                                      </span>
                                      <p>하이어라운드 테니스댐프너</p>
                                  </div>
                              </div>
                            </Link>
                        </SwiperSlide>
                        </Swiper>  
                    </div>
                </div>
                    
            </div>
            <Footer/>
        </div>
        
    );
}

export default Main;