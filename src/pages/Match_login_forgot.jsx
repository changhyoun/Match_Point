// 아이디ㆍ비밀번호 찾기 페이지

import React, { useState, useEffect } from 'react';
import './Match_login_forgot.css';
import { login_back, MatchPoint_logo, MatchPoint_id_ic, MatchPoint_birth_ic, MatchPoint_name_ic, find_account_check, find_account_cancel } from './Images'; // 이미지 import
import BackArrow from '../components/BackArrow';
import Refind from '../components/Refind';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import FindPw from '../components/FindPw';
import { Link } from 'react-router-dom';

function Match_login_forgot() {
    const [activeTab, setActiveTab] = useState(0); // 초기 활성화된 탭 인덱스 설정
    const [birthDate, setBirthDate] = useState(null); // 생년월일 state
    const [nameInput, setNameInput] = useState(''); // 이름 입력 상태(state)
    const [idInput, setIdInput] = useState(''); // 아이디 입력 상태(state)
    const [nameError, setNameError] = useState(false); // 이름 입력 오류 상태(state)
    const [birthError, setBirthError] = useState(false); // 생년월일 입력 오류 상태(state)
    const [idError, setIdError] = useState(false); // 아이디 입력 오류 상태(state)
    const [showPopup, setShowPopup] = useState(false); // 아이디 찾기 완료 팝업 보이기 상태(state)
    const [showPasswordPopup, setShowPasswordPopup] = useState(false); // 비밀번호 찾기 완료 팝업 보이기 상태(state)
    const [showNotFoundPopup, setShowNotFoundPopup] = useState(false); // 아이디나 비밀번호 찾기 실패 팝업 보이기 상태(state)
    const [foundUserName, setFoundUserName] = useState(''); // 찾은 사용자 이름 상태(state)
    const [foundUserId, setFoundUserId] = useState(''); // 찾은 사용자 아이디 상태(state)
    const [foundUserPw, setFoundUserPw] = useState(''); // 찾은 사용자 비밀번호 상태(state)

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab !== null) {
            setActiveTab(parseInt(savedTab));
        }
    }, []);

    useEffect(() => {
        if (showPopup) {
            console.log('아이디 찾기 팝업이 보입니다.');
            const findIdImage = document.querySelector('.findIdImage')
            findIdImage.classList.add('rotate')
        }
    }, [showPopup]);
    useEffect(() => {
        if (showPasswordPopup) {
            console.log('비밀번호 찾기 팝업이 보입니다.');
            const findPwImage = document.querySelector('.findPwImage')
            findPwImage.classList.add('rotate')
        }
    }, [showPasswordPopup]);
    useEffect(() => {
        if (showNotFoundPopup) {
            console.log('아이디ㆍ비밀번호 못찾은 팝업이 보입니다.');
            const notFindImage = document.querySelector('.notFindImage')
            notFindImage.classList.add('rotate')
        }
    }, [showNotFoundPopup]);

    const handleTabClick = (index) => {
        setActiveTab(index);
        localStorage.setItem('activeTab', index);
        // 탭이 변경될 때 모든 오류 메시지 초기화
        setNameError(false);
        setBirthError(false);
        setIdError(false);
        // 모든 팝업 숨기기
        setShowPopup(false);
        setShowPasswordPopup(false);
        setShowNotFoundPopup(false);
        // .Match_login_forgot_warp_inner 요소 스타일 초기화
        const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
        if (matchLoginForgotWarpInner) {
            matchLoginForgotWarpInner.style.filter = 'none';
            matchLoginForgotWarpInner.style.pointerEvents = 'auto';
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleBirthDateChange = (date) => {
        setBirthDate(date);
    };

    const handleNameInputChange = (event) => {
        setNameInput(event.target.value);
    };

    const handleIdInputChange = (event) => {
        setIdInput(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        // 로컬 스토리지에서 사용자 데이터 불러오기
        const storedUserData = JSON.parse(localStorage.getItem('users'));

        // 데이터가 null인 경우 처리
        if (!storedUserData || !Array.isArray(storedUserData) || storedUserData.length === 0) {
            alert('저장된 사용자 데이터가 없거나 잘못된 형식입니다.');
            return;
        }

        // 각 탭에 따라 필수 입력 항목 확인
        if (activeTab === 0) { // 아이디 찾기 탭
            if (!nameInput) {
                setNameError(true);
                return; // 이름이 없으면 바로 종료
            } else {
                setNameError(false);
            }
            if (!birthDate) {
                setBirthError(true);
                return; // 생년월일이 없으면 바로 종료
            } else {
                setBirthError(false);
            }

            const formattedBirthDate = formatDate(birthDate);
            const foundUser = storedUserData.find(user => user.name === nameInput && user.birth === formattedBirthDate);
            if (foundUser) {
                // 찾은 사용자 정보 설정
                setFoundUserName(foundUser.name);
                setFoundUserId(foundUser.id);
                // 팝업 보이기 설정
                setShowPopup(true);
                setShowNotFoundPopup(false);
                setShowPasswordPopup(false);
                // .Match_login_forgot_warp_inner 요소 스타일 변경
                const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
                if (matchLoginForgotWarpInner) {
                    matchLoginForgotWarpInner.style.filter = 'brightness(0.5)';
                    matchLoginForgotWarpInner.style.pointerEvents = 'none';
                }
            } else {
                // .Match_login_forgot_warp_inner 요소 스타일 변경
                const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
                if (matchLoginForgotWarpInner) {
                    matchLoginForgotWarpInner.style.filter = 'brightness(0.5)';
                    matchLoginForgotWarpInner.style.pointerEvents = 'none';
                }
                // 찾기 실패 팝업 보이기 설정
                setShowNotFoundPopup(true);
                setShowPopup(false);
                setShowPasswordPopup(false);
            }
        } else if (activeTab === 1) { // 비밀번호 찾기 탭
            if (!nameInput) {
                setNameError(true);
                return; // 이름이 없으면 바로 종료
            } else {
                setNameError(false);
            }
            if (!birthDate) {
                setBirthError(true);
                return; // 생년월일이 없으면 바로 종료
            } else {
                setBirthError(false);
            }
            if (!idInput) {
                setIdError(true);
                return; // 아이디가 없으면 바로 종료
            } else {
                setIdError(false);
            }

            const formattedBirthDate = formatDate(birthDate);
            const foundUser = storedUserData.find(user => user.name === nameInput && user.birth === formattedBirthDate && user.id === idInput);
            if (foundUser) {
                // 비밀번호 찾기 시 추가 처리 필요
                // 찾은 사용자 비밀번호 설정
                setFoundUserName(foundUser.name);
                setFoundUserPw(foundUser.password);
                // 비밀번호 찾기 완료 팝업 보이기 설정
                setShowPasswordPopup(true);
                setShowPopup(false);
                setShowNotFoundPopup(false);
                // .Match_login_forgot_warp_inner 요소 스타일 변경
                const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
                if (matchLoginForgotWarpInner) {
                    matchLoginForgotWarpInner.style.filter = 'brightness(0.5)';
                    matchLoginForgotWarpInner.style.pointerEvents = 'none';
                }
            } else {
                // .Match_login_forgot_warp_inner 요소 스타일 변경
                const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
                if (matchLoginForgotWarpInner) {
                    matchLoginForgotWarpInner.style.filter = 'brightness(0.5)';
                    matchLoginForgotWarpInner.style.pointerEvents = 'none';
                }
                // 찾기 실패 팝업 보이기 설정
                setShowNotFoundPopup(true);
                setShowPopup(false);
                setShowPasswordPopup(false);
            }
        }
    };

    const handleRefindClick = () => {
        // 입력 필드 초기화
        setNameInput('');
        setBirthDate(null);
        setIdInput('');
        // 오류 상태 초기화
        setNameError(false);
        setBirthError(false);
        setIdError(false);
        // 모든 팝업 숨기기
        setShowPopup(false);
        setShowPasswordPopup(false);
        setShowNotFoundPopup(false);
        // .Match_login_forgot_warp_inner 요소 스타일 초기화
        const matchLoginForgotWarpInner = document.querySelector('.Match_login_forgot_warp_inner');
        if (matchLoginForgotWarpInner) {
            matchLoginForgotWarpInner.style.filter = 'none';
            matchLoginForgotWarpInner.style.pointerEvents = 'auto';
        }
    };


    return (
        <div id="Match_login_forgot">
            <img src={login_back} alt="login_back" />
            <div className="Match_login_forgot_warp">
                {/* 아이디 찾기 완료 팝업 */}
                {showPopup && (
                    <div className="Match_login_forgot_popup_id_find Match_login_forgot_popup">
                        <div className="popup_id_find_inner">
                            <Link to={'/Match_login'}>
                                <BackArrow BackArrow_txt={"로그인 페이지로 이동"} />
                            </Link>
                            <FindPw FindPw_txt={"비밀번호 찾기"} />
                            {/* <img className='findIdImage' src={find_account_check} alt="find_account_check"/> */}
                            <img className={`findIdImage`} src={find_account_check} alt="find_account_check" />
                            <p>아이디 찾기가 완료되었습니다<br />
                                <span>{foundUserName}</span>님의 아이디는 <em>{foundUserId}</em>입니다</p>
                        </div>
                    </div>
                )}
                {/* 비밀번호 찾기 완료 팝업 */}
                {showPasswordPopup && (
                    <div className="Match_login_forgot_popup_pw_find Match_login_forgot_popup">
                        <div className="popup_pw_find_inner">
                            <Link to={'/Match_login'}>
                                <BackArrow BackArrow_txt={"로그인 페이지로 이동"} />
                            </Link>
                            <img className='findPwImage' src={find_account_check} alt="find_account_check" />
                            <p>비밀번호 찾기가 완료되었습니다<br/>
                            <span>{foundUserName}</span>님의 비밀번호는<br/><em>{foundUserPw}</em>입니다</p>
                        </div>
                    </div>
                )}
                {/* 아이디/비밀번호 찾기 실패 팝업 */}
                {showNotFoundPopup && (
                    <div className="Match_login_forgot_popup_not Match_login_forgot_popup">
                        <div className="Match_login_forgot_popup_not_inner">
                            <Link to={'/Match_login'}>
                                <BackArrow BackArrow_txt={"로그인 페이지로 이동"} />
                            </Link>
                            <Refind Refind_txt={"다시 찾아보기"} onClick={handleRefindClick}/>
                            <img className='notFindImage' src={find_account_cancel} alt="find_account_check" />
                            <p>해당하는 아이디ㆍ비밀번호를<br/>
                            찾을 수 없습니다.</p>
                        </div>
                    </div>
                )}
                <Link to={'/Match_login'}>
                    <BackArrow BackArrow_txt={"로그인 페이지로 이동"} />
                </Link>
                <div className="Match_login_forgot_warp_inner">
                    <img src={MatchPoint_logo} alt="MatchPoint_logo" />
                    
                    {/* Tabs */}
                    <div className="tabs">
                        <button 
                            className={activeTab === 0 ? 'tab active' : 'tab'}
                            onClick={() => handleTabClick(0)}
                        >
                            아이디 찾기
                        </button>
                        <button 
                            className={activeTab === 1 ? 'tab active' : 'tab'}
                            onClick={() => handleTabClick(1)}
                        >
                            비밀번호 찾기
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 0 && (
                            <div className="tab-pane">
                                {/* 아이디 찾기 내용 */}
                                <form onSubmit={handleFormSubmit}>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            placeholder="이름을 입력하세요" 
                                            className="name_input" 
                                            value={nameInput}
                                            onChange={handleNameInputChange}
                                        />
                                        <img src={MatchPoint_name_ic} alt="MatchPoint_name_ic" />
                                    </div>
                                    {nameError && <p>이름을 입력하세요 ❗</p>}
                                    <div className="input-group">
                                        <DatePicker
                                            selected={birthDate}
                                            onChange={handleBirthDateChange}
                                            placeholderText="생년월일을 선택하세요"
                                            className="birth_input"
                                            dateFormat="yyyy-MM-dd"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            popperPlacement="bottom"
                                            onFocus={(e) => e.target.blur()} // 모바일에서 키보드 자판 방지
                                            
                                        />
                                        <img src={MatchPoint_birth_ic} alt="MatchPoint_birth_ic" />
                                    </div>
                                    {birthError && <p>생년월일을 선택하세요 ❗</p>}
                                    <button type="submit">아이디 찾기</button>
                                </form>
                            </div>
                        )}
                        {activeTab === 1 && (
                            <div className="tab-pane">
                                {/* 비밀번호 찾기 내용 */}
                                <form onSubmit={handleFormSubmit}>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            placeholder="이름을 입력하세요" 
                                            className="name_input" 
                                            value={nameInput}
                                            onChange={handleNameInputChange}
                                        />
                                        <img src={MatchPoint_name_ic} alt="MatchPoint_name_ic" />
                                    </div>
                                    {nameError && <p>이름을 입력하세요 ❗</p>}
                                    <div className="input-group">
                                        <DatePicker
                                            selected={birthDate}
                                            onChange={handleBirthDateChange}
                                            placeholderText="생년월일을 선택하세요"
                                            className="birth_input"
                                            dateFormat="yyyy-MM-dd"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            onFocus={(e) => e.target.blur()} // 모바일에서 키보드 자판 방지
                                            popperPlacement="bottom"
                                            
                                        />
                                        <img src={MatchPoint_birth_ic} alt="MatchPoint_birth_ic" />
                                    </div>
                                    {birthError && <p>생년월일을 선택하세요 ❗</p>}
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            placeholder="아이디를 입력하세요" 
                                            className="id_input" 
                                            value={idInput}
                                            onChange={handleIdInputChange}
                                  
                                        />
                                        
                                        <img src={MatchPoint_id_ic} alt="MatchPoint_id_ic" />
                                    </div>
                                    {idError && <p>아이디를 입력하세요 ❗</p>}
                                    <button type="submit">비밀번호 찾기</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Match_login_forgot;
