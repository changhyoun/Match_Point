import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo_header from '../components/Logo_header';
import Footer from '../components/Footer';
import './All_Court.css';
import { white_tennis_man,not_reservation } from './Images';
import TennisCourtData from '../../data/TennisCourt-data.json';

function All_Court() {
    const [selectedRegion, setSelectedRegion] = useState('지역');
    const [selectedCoatType, setSelectedCoatType] = useState('코트 종류');
    const [selectedCourtNumber, setSelectedCourtNumber] = useState('코트 수');
    const [showRegionFilter, setShowRegionFilter] = useState(false);
    const [showCoatTypeFilter, setShowCoatTypeFilter] = useState(false);
    const [showCourtNumberFilter, setShowCourtNumberFilter] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const navigate = useNavigate();

    const regionFilterRef = useRef();
    const coatTypeFilterRef = useRef();
    const courtNumberFilterRef = useRef();
    const filterContainerRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterContainerRef.current && !filterContainerRef.current.contains(event.target)
            ) {
                if (showRegionFilter || showCoatTypeFilter || showCourtNumberFilter) {
                    setIsFadingOut(true);
                    setTimeout(() => {
                        setShowRegionFilter(false);
                        setShowCoatTypeFilter(false);
                        setShowCourtNumberFilter(false);
                        setIsFadingOut(false);
                    }, 300);
                }
            }
        };

        const handleScroll = () => {
            if (showRegionFilter || showCoatTypeFilter || showCourtNumberFilter) {
                setIsFadingOut(true);
                setTimeout(() => {
                    setShowRegionFilter(false);
                    setShowCoatTypeFilter(false);
                    setShowCourtNumberFilter(false);
                    setIsFadingOut(false);
                }, 300);
            }
        };

        window.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [showRegionFilter, showCoatTypeFilter, showCourtNumberFilter]);

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
        setShowRegionFilter(false);
    };

    const handleCoatTypeClick = (coatType) => {
        setSelectedCoatType(coatType);
        setShowCoatTypeFilter(false);
    };

    const handleCourtNumberClick = (courtNumber) => {
        setSelectedCourtNumber(courtNumber);
        setShowCourtNumberFilter(false);
    };

    const filteredCourts = TennisCourtData.filter(court =>
        (selectedRegion === '전체' || selectedRegion === '지역' || court.region === selectedRegion) &&
        (selectedCoatType === '전체' || selectedCoatType === '코트 종류' || court.coatType === selectedCoatType) &&
        (selectedCourtNumber === '전체' || selectedCourtNumber === '코트 수' || court.courtNumber === selectedCourtNumber)
    );

    return (
        <div id="All_Court" ref={filterContainerRef}>
            <Logo_header />
            <div className="All_Court_hd">
                <div className="All_Court_hd_warp">
                    <h3 onClick={() => { setShowRegionFilter(!showRegionFilter); setShowCoatTypeFilter(false); setShowCourtNumberFilter(false); }}>{selectedRegion}</h3>
                    <h3 onClick={() => { setShowCoatTypeFilter(!showCoatTypeFilter); setShowRegionFilter(false); setShowCourtNumberFilter(false); }}>{selectedCoatType}</h3>
                    <h3 onClick={() => { setShowCourtNumberFilter(!showCourtNumberFilter); setShowRegionFilter(false); setShowCoatTypeFilter(false); }}>{selectedCourtNumber}</h3>
                </div>
                
                {showRegionFilter && (
                    <div ref={regionFilterRef} className={`select_region court_filter_select ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
                        <div className="court_filter_select_top">
                            지역을 선택해주세요.
                        </div>
                        <div className="court_filter_select_center">
                            <div className="court_filter_select_center_warp">
                                {['전체', '서울', '부산', '인천', '대구', '대전', '울산', '광주'].map(region => (
                                    <button key={region} onClick={() => handleRegionClick(region)}>{region}</button>
                                ))}
                            </div>
                        </div>
                        <div className="court_filter_select_bt">
                            포트폴리오용이기에 간략하게 표시됩니다.
                        </div>
                    </div>
                )}
                
                {showCoatTypeFilter && (
                    <div ref={coatTypeFilterRef} className={`select_region court_filter_select ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
                        <div className="court_filter_select_top">
                            코트 종류를 선택해주세요.
                        </div>
                        <div className="court_filter_select_center">
                            <div className="court_filter_select_center_warp">
                                {['전체', '하드 코트', '클레이 코트', '흙 코트', '인조잔디 코트', '실내 코트'].map(coatType => (
                                    <button key={coatType} onClick={() => handleCoatTypeClick(coatType)}>{coatType}</button>
                                ))}
                            </div>
                        </div>
                        <div className="court_filter_select_bt">
                            포트폴리오용이기에 간략하게 표시됩니다.
                        </div>
                    </div>
                )}

                {showCourtNumberFilter && (
                    <div ref={courtNumberFilterRef} className={`select_region court_filter_select ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
                        <div className="court_filter_select_top">
                            테니스장의 코트 수를 선택해주세요.
                        </div>
                        <div className="court_filter_select_center">
                            <div className="court_filter_select_center_warp">
                                {['전체', '1개', '2~4개', '5~9개', '9개 이상'].map(courtNumber => (
                                    <button key={courtNumber} onClick={() => handleCourtNumberClick(courtNumber)}>{courtNumber}</button>
                                ))}
                            </div>
                        </div>
                        <div className="court_filter_select_bt">
                            포트폴리오용이기에 간략하게 표시됩니다.
                        </div>
                    </div>
                )}
            </div>
            <div className="All_Court_main" onClick={() => {
                if (showRegionFilter || showCoatTypeFilter || showCourtNumberFilter) {
                    setIsFadingOut(true);
                    setTimeout(() => {
                        setShowRegionFilter(false);
                        setShowCoatTypeFilter(false);
                        setShowCourtNumberFilter(false);
                        setIsFadingOut(false);
                    }, 300);
                }
            }}>
                <div className="All_Court_main_warp">
                    {filteredCourts.length > 0 ? (
                        filteredCourts.map(court => (
                            <div key={court.id} className="court_box" onClick={() => navigate(`/court/${court.id}`)}>
                                <img src={court.main_img} alt={court.name} />
                                <img className='white_tennis_man' src={white_tennis_man} alt="Tennis player" />
                                <div className="court_box_warp">
                                    <div className="court_box_warp_top">
                                        <span>{court.region}</span><span>{court.coatType}</span>
                                    </div>
                                    <div className="court_box_warp_center">
                                        <h2>{court.name}</h2>
                                        <p>{court.address}</p>
                                    </div>
                                    <div className="court_box_warp_bt">
                                        <span className="material-symbols-rounded">login</span>
                                        상세 정보
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no_courts_message">
                               <img className='not_reservation_img' src={not_reservation} alt='not_reservation' />
                            <h3>해당하는 코트가 없는거 같아요!</h3>
                        </div>
                
                     
   
                    )}
                </div>
                <p className="portfolio_tx">
                    이 사이트는 비상업적인용으로<br />각 지역별로 5개까지만 표시됩니다.
                </p>
            </div>
            <Footer />
        </div>
    );
}

export default All_Court;