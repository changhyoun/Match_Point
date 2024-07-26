// 코트 상세정보 페이지

import React, { useState, useEffect } from 'react';
import './CourtDetail.css';
import { Link, useParams } from 'react-router-dom';
import TennisCourtData from '../../data/TennisCourt-data.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
import CourtDetail_header from '../components/CourtDetail_header';
import Footer from '../components/Footer';
import KakaoMap from '../components/KakaoMap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import { find_account_check } from './Images';

function CourtDetail() {
    const { id } = useParams();
    const court = TennisCourtData.find((court) => court.id === id);

    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [reservationData, setReservationData] = useState({});

    useEffect(() => {
        if (reservationSuccess) {
            const imgElement = document.querySelector('.CourtDetail_main_reservation_suc img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1)';
            }
        }
    }, [reservationSuccess]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('reservation_data')) || {};
        setReservationData(storedData);
    }, []);

    const handleReservationOpen = () => {
        setIsReservationOpen(true);
    };

    const handleReservationClose = () => {
        setIsReservationOpen(false);
    };

    const minTime = new Date();
    minTime.setHours(6, 0);

    const maxTime = new Date();
    maxTime.setHours(22, 0);

    const getMinEndTime = () => {
        if (!startDate) return minTime;
        const minEndTime = new Date(startDate);
        if (minEndTime.getHours() < 6) minEndTime.setHours(6, 0);
        return minEndTime;
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date >= endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        if (startDate && startOfDay(startDate).getTime() !== startOfDay(date).getTime()) {
            alert('동일한 날에만 예약할 수 있습니다.');
            setEndDate(null);
        } else {
            if (startDate && startDate >= date) {
                alert('예약 시간은 최소 1시간입니다.');
                setEndDate(null);
            } else {
                setEndDate(date);
            }
        }
    };

    const checkReservationConflict = (userId, startTime, endTime) => {
        const userReservations = reservationData[userId] || [];
        return userReservations.find((reservation) => {
            const reservationStart = new Date(reservation.startTime);
            const reservationEnd = new Date(reservation.endTime);
            return (
                (startTime >= reservationStart && startTime < reservationEnd) ||
                (endTime > reservationStart && endTime <= reservationEnd) ||
                (startTime <= reservationStart && endTime >= reservationEnd)
            );
        });
    };
    
    const handleReservationSubmit = () => {
        if (!startDate || !endDate) {
            alert('시작시간과 종료시간을 입력해주세요!');
            return;
        }
    
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userId = currentUser.id; // 사용자의 고유 식별자
    
        const newReservation = {
            courtName: court.name,
            userName: currentUser.name,
            userPhone: currentUser.phoneNumber,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            main_img: court.main_img,
        };
    
       
        const conflictingReservation = checkReservationConflict(userId, startDate, endDate);
        if (conflictingReservation) {
            alert(`${currentUser.name}님은 해당 시간대에 이미 ${conflictingReservation.courtName}에 예약이 되어있습니다.`);
            return;
        }
    

        const updatedReservations = {
            ...reservationData,
            [userId]: [...(reservationData[userId] || []), newReservation],
        };
    
        localStorage.setItem('reservation_data', JSON.stringify(updatedReservations));
    
        setUserName(currentUser.name);
        setUserPhone(currentUser.phoneNumber);
        setReservationSuccess(true);
    };

    const handleReloadPage = () => {
        window.location.reload();
    };

    const slides = [court.img1, court.img2, court.img3].filter(img => img);

    return (
        <div className="CourtDetail">
            <CourtDetail_header />
            <div className="CourtDetail_header_2">
                <h3>{court.name}</h3>
            </div>
            <div className={`CourtDetail_main ${isReservationOpen ? 'blurred' : ''}`}>
                <div className="CourtDetail_main_slide">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={50}
                        slidesPerView={1}
                        onSlideChange={() => console.log('slide change')}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        navigation={slides.length > 1 ? {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        } : false}
                    >
                        {slides.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={image} alt={`Image ${index + 1}`} />
                            </SwiperSlide>
                        ))}
                        {slides.length > 1 && (
                            <div className='swiper-button_warp'>
                                <div className="swiper-button-next next1">
                                    <span class="material-symbols-rounded">
                                        swipe_left
                                    </span>
                                </div>
                                <div className="swiper-button-prev prev1">
                                    <span class="material-symbols-rounded">
                                        swipe_left
                                    </span>
                                </div>
                            </div>
                        )}
                    </Swiper>
                </div>
                <div className="CourtDetail_main_warp">
                    <div className="CourtDetail_main_box1">
                        <h4>{court.name}</h4>
                        <p>주소 : {court.address}</p>
                    </div>

                    <button className="CourtDetail_main_box2" onClick={handleReservationOpen}>
                        이 테니스장 예약하기
                    </button>

                    <div className="CourtDetail_main_box3">
                        <a className='call' href={`tel:${court.call}`}>
                          <span className="material-symbols-rounded">phone_forwarded</span>
                        </a>
                        <h4>테니스장 정보</h4>
                        <ul>
                            <li>이용시간 : {court.time}</li>
                            <li>코트 종류 : {court.coatType}</li>
                            <li>코트 수 : {court.courtNumber}</li>
                            <li>가격 : {court.price}</li>
                        </ul>
                    </div>
                    <div className="CourtDetail_main_box4">
                        <h4>위치 정보</h4>
                        <ul>
                            <li>테니스장 명 : {court.name}</li>
                            <li>주소 : {court.address}</li>
                        </ul>
                        <KakaoMap latitude={court.latitude} longitude={court.longitude} />
                    </div>
                </div>
            </div>
            <div className={`CourtDetail_main_reservation ${isReservationOpen ? 'open' : ''}`}>
                <h4>{court.name}</h4>
                <p>예약 날짜와 시간을 선택하세요.</p>
                <div className="reservation_time">
                    <div className="start_time">
                        <span>시작 :</span>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeCaption="시간"
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 30)}
                            minTime={minTime}
                            maxTime={maxTime}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            onFocus={(e) => e.target.blur()} // 모바일에서 키보드 자판 방지
                            placeholderText='날짜 및 시간 선택'
                        />
                        {!startDate && <p>시작시간을 입력해주세요❗</p>}
                    </div>
                    <div className="end_time">
                        <span>종료 :</span>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeCaption="시간"
                            minDate={startDate ? startDate : new Date()}
                            maxDate={addDays(new Date(), 30)}
                            minTime={startDate ? getMinEndTime() : minTime}
                            maxTime={maxTime}
                            selectsEnd
                            startDate={startDate}
                            onFocus={(e) => e.target.blur()} // 모바일에서 키보드 자판 방지
                            endDate={endDate}
                            placeholderText='날짜 및 시간 선택'
                        />
                        {!endDate && <p>종료시간을 입력해주세요❗</p>}
                    </div>
                </div>
                <button className="reser_btn" onClick={handleReservationSubmit}>
                    예약하기
                </button>
                <span className="material-symbols-rounded CourtDetail_main_reservation_close" onClick={handleReservationClose}>
                    close
                </span>
            </div>
            {reservationSuccess && (
                <div className="CourtDetail_main_reservation_suc">
                    <img src={find_account_check} alt="reservation_check"  />
                    <h4>{userName}님 {court.name}<br />예약 완료되었습니다.</h4>
                    <div className="reservation_suc_time">
                        <span>예약시간</span>
                        <p>{format(new Date(startDate), 'yyyy.MM.dd HH:mm')} ~ {format(new Date(endDate), 'HH:mm')}<br/> <em>({Math.abs(new Date(endDate) - new Date(startDate)) / 36e5}시간)</em></p>
                    </div>
                    <span class="material-symbols-rounded cir_close" onClick={handleReloadPage}>
                        cancel
                    </span>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default CourtDetail;

