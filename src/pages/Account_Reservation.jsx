// 예약확인 페이지

import React, { useEffect, useState, useRef } from 'react';
import Logo_header from '../components/Logo_header';
import Footer from '../components/Footer';
import './Account_Reservation.css';
import { not_reservation, reservation_time, reservation_cancel_popup_img, find_account_check, find_account_cancel } from './Images';

function Account_Reservation() {
    const [reservationData, setReservationData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [cancelPopupActive, setCancelPopupActive] = useState(false);
    const [surePopupActive, setSurePopupActive] = useState(false);
    const [selectedReservationIndex, setSelectedReservationIndex] = useState(null);
    const [filter, setFilter] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);

        if (user) {
            const storedData = JSON.parse(localStorage.getItem('reservation_data')) || {};
            setReservationData(storedData[user.id] || []);
        }
    }, []);

    const formatTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? '오후' : '오전';
        const formattedHours = String(hours % 12 || 12).padStart(2, '0');

        return `${year}. ${month}. ${day}. ${period} ${formattedHours}:${minutes}`;
    };

    const handleCancelReservation = (reservationIndex) => {
        setSelectedReservationIndex(reservationIndex);
        setCancelPopupActive(true);
    };

    const handleConfirmCancel = () => {
        const updatedReservations = reservationData.filter((_, index) => index !== selectedReservationIndex);
        setReservationData(updatedReservations);

        const storedData = JSON.parse(localStorage.getItem('reservation_data')) || {};
        storedData[currentUser.id] = updatedReservations;
        localStorage.setItem('reservation_data', JSON.stringify(storedData));

        setCancelPopupActive(false);
        setSurePopupActive(true);
    };

    const handleClosePopup = () => {
        setCancelPopupActive(false);
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
        setDropdownOpen(false);
    };

    const getFilteredReservations = () => {
        let filteredReservations = [...reservationData];
        const now = new Date();

        switch (filter) {
            case 'latest':
                filteredReservations.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                break;
            case 'oldest':
                filteredReservations.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                break;
            case 'past':
                filteredReservations = filteredReservations.filter(reservation => new Date(reservation.endTime) < now);
                break;
            case 'upcoming':
                filteredReservations = filteredReservations.filter(reservation => new Date(reservation.endTime) >= now);
                break;
            default:
                break;
        }

        return filteredReservations;
    };

    const filteredReservations = getFilteredReservations();

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const reservation_cancel_popup_warpImg = document.querySelector('.reservation_cancel_popup .reservation_cancel_popup_warp img');
        if(cancelPopupActive){
            reservation_cancel_popup_warpImg.style.transform = 'rotateY(0)';
        }
    })
    
    useEffect(() => {
        const surePopupActiveImg = document.querySelector('.reservation_cancel_sure_popup img');
        if(surePopupActive){
            surePopupActiveImg.style.transform = 'scale(1)';
        }
    })

    return (
        <div id="Account_Reservation">
            <Logo_header />
            <div className="Account_Reservation_hd">
                <div className="Account_Reservation_hd_warp">
                    <h3>예약 내역</h3>
                </div>
            </div>
            <div className={`reservation_cancel_popup ${cancelPopupActive ? 'active' : ''}`}>
                <div className="reservation_cancel_popup_warp">
                    <h3>{currentUser && currentUser.name}님, 예약을<br />
                        취소 및 삭제 하시겠어요?</h3>
                    <div className="reservation_cancel_popup_time_warp">
                        <p>시작 시간: {formatTime(new Date(reservationData[selectedReservationIndex]?.startTime))}</p>
                        <p>종료 시간: {formatTime(new Date(reservationData[selectedReservationIndex]?.endTime))}</p>
                    </div>
                    <img src={reservation_cancel_popup_img} alt='reservation_cancel_popup_img' />
                    <div className='reservation_cancel_popup_btn_warp'>
                        <button className="sure" onClick={handleConfirmCancel}>
                            예약 취소 및 삭제
                        </button>
                        <button className="cancel" onClick={handleClosePopup}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
            <div className={`reservation_cancel_sure_popup ${surePopupActive ? 'active' : ''}`}>
                <h3>감사합니다<br />예약 취소 및 삭제 되었습니다.</h3>
                <img src={find_account_check} alt='find_account_check' />
                <span className="material-symbols-rounded" onClick={handleReload}>
                    cancel
                </span>
            </div>
            <div className={`Account_Reservation_main ${cancelPopupActive ? 'no_active' : ''}`}>
                <div className="Account_Reservation_main_warp">
                <div className="Account_Reservation_main_filter" ref={dropdownRef}>
                    <div className="filter_selected" onClick={toggleDropdown}>
                            <span>
                                {filter === 'all' ? '모두' : filter === 'latest' ? '최신순' : filter === 'oldest' ? '오랜된순' : filter === 'past' ? '기간이 지난 예약' : '기간이 안지난 예약'}
                            </span>
                            <span className="arrow">
                                <span className="material-symbols-rounded">{dropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
                            </span>
                        </div>
                        <div className={`filter_options ${dropdownOpen ? 'show' : ''}`}>
                            <div onClick={() => handleFilterChange('all')}>모두</div>
                            <div onClick={() => handleFilterChange('latest')}>최신순</div>
                            <div onClick={() => handleFilterChange('oldest')}>오랜된순</div>
                            <div onClick={() => handleFilterChange('past')}>기간이 지난 예약</div>
                            <div onClick={() => handleFilterChange('upcoming')}>기간이 안지난 예약</div>
                        </div>

                    </div>
                    {currentUser && filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation, index) => {
                            const startTime = new Date(reservation.startTime);
                            const endTime = new Date(reservation.endTime);
                            const isPastReservation = endTime < new Date();

                            return (
                                <div
                                    key={index}
                                    className="reservation_item reservation_items_all"
                                >
                                    <img className='reservation_item_back' src={`${reservation.main_img}`} alt={`${reservation.main_img}`} />
                                    <div className="reservation_details_warp">
                                        <div className="reservation_details_lt">
                                            {isPastReservation && (
                                                <span className="past_reservation">시간이 지난 예약이에요!</span>
                                            )}
                                            <h3>{reservation.courtName}</h3>
                                            <div className="reservation_time">
                                                <p>시작 시간: {formatTime(startTime)}</p>
                                                <p>종료 시간: {formatTime(endTime)}</p>
                                            </div>
                                            <div>
                                                <button
                                                    className="cancel_reservation"
                                                    onClick={() => handleCancelReservation(index)}
                                                >
                                                    <img src={find_account_cancel} alt="find_account_cancel" />
                                                    {isPastReservation ? '삭제' : '예약 취소'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="reservation_details_rt">
                                            <img src={reservation_time} alt={reservation_time} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="not_reservation reservation_items_all">
                            <img className='not_reservation_img' src={not_reservation} alt='not_reservation' />
                            <h3>{currentUser && currentUser.name}님의 예약하신 내역이 없는거 같아요!</h3>
                            <p>하단에 코트를 클릭 후 예약을 진행해보세요!</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Account_Reservation;