// 내정보 페이지

import React, { useState, useEffect, } from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './Match_MyInfo.css';
import Logo_header from '../components/Logo_header';
import Footer from '../components/Footer';
import { Info_greenSmiling, Info_grade0, Info_grade1, Info_grade2, Info_grade3, Info_feedback_man, MatchPoint_id_ic, MatchPoint_pw_ic_lock, MatchPoint_pw_ic_show, MatchPoint_pw_ic_hide, find_account_check,delete_pop_man } from './Images';
import keys from '../../keys/keys';

function Match_MyInfo() {
    const navigate = useNavigate();
    const user2 = JSON.parse(localStorage.getItem('currentUser'));
    const reservationData = JSON.parse(localStorage.getItem('reservation_data')) || {};
    const userReservations = reservationData[user2.id] || [];
    const reservationCount = userReservations.length;

    let grade, gradeImage;
    if (reservationCount === 0) {
        grade = '아이언';
        gradeImage = Info_grade0;
    } else if (reservationCount === 1) {
        grade = '브론즈';
        gradeImage = Info_grade1;
    } else if (reservationCount >= 2 && reservationCount <= 5) {
        grade = '실버';
        gradeImage = Info_grade2;
    } else {
        grade = '골드';
        gradeImage = Info_grade3;
    }

    const [feedback, setFeedback] = useState('');
    const [activeTab, setActiveTab] = useState('idChange');
    const [oldId, setOldId] = useState('');
    const [newId, setNewId] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [idError, setIdError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [changeCompleted, setChangeCompleted] = useState(false);

    const handleFeedbackChange = (e) => setFeedback(e.target.value);
    const handleOldIdChange = (e) => setOldId(e.target.value);
    const handleNewIdChange = (e) => setNewId(e.target.value);
    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    useEffect(() => {
        const feedbackElement = document.querySelector('.feedback');
        if (feedbackElement) {
            feedbackElement.style.opacity = '1';
            feedbackElement.style.transform = 'scale(1)';
            feedbackElement.style.transform = 'translateX(-50%)';
        }
    }, []);


    const handleCloseFeedback = () => {
        const feedbackElement = document.querySelector('.feedback');
        const myInfoMenuElement = document.querySelector('.myInfo_menu');
        const mainProfileBox = document.querySelector('.myInfo_main_profile > div > div:nth-of-type(1)');
        const mainProfileBox2 = document.querySelector('.myInfo_main_profile > div > div:nth-of-type(2)');

        if (feedbackElement) {
            mainProfileBox.style.height = "100%";
            mainProfileBox2.style.height = "100%";
            feedbackElement.style.opacity = '0';
            feedbackElement.style.zIndex = '-100';
        }
        if (myInfoMenuElement) {
            myInfoMenuElement.style.marginTop = '2%';
        }
    };

    const sendFeedback = (e) => {
        e.preventDefault();
        const confirmMessage = `아이디: ${user2.id}\n내용: ${feedback}\n\n이대로 제출하시겠습니까?`;
        const userConfirmed = window.confirm(confirmMessage);
        if (!userConfirmed) return;

        const templateParams = {
            user_name: user2.name,
            user_id: user2.id,
            message: feedback,
        };

        emailjs.send('service_9111f98', 'template_qi5fx4e', templateParams, keys.EmailJSApiKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert('피드백이 성공적으로 전송되었습니다.');
                setFeedback('');
            }, (err) => {
                console.log('FAILED...', err);
                alert('피드백 전송에 실패했습니다.');
            });
    };

    const handleIdChange = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (oldId !== user2.id) {
            setIdError('기존 아이디가 다릅니다 ❗');
            return;
        }

        if (users.some(user => user.id === newId)) {
            alert('새로운 아이디가 이미 존재합니다 ❗');
            return;
        }

        if (oldId === newId) {
            alert('새로운 아이디가 기존 아이디와 동일합니다 ❗');
            return;
        }

        const updatedUser = { ...user2, id: newId };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        const userIndex = users.findIndex(u => u.id === user2.id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            setChangeCompleted(true);
        } else {
            console.error('users 배열에 사용자 정보를 찾을 수 없습니다:', user2);
        }

        setIdError('');
        console.log('currentUser:', updatedUser);
        console.log('users:', JSON.parse(localStorage.getItem('users')));
    };

    const validatePassword = (password) => {
        const isLongEnough = password.length >= 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return isLongEnough && hasSpecialChar;
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (oldPassword !== user2.password) {
            setPasswordMessage('사용자의 기존 비밀번호랑 일치하지 않습니다 ❗');
            return;
        }

        if (oldPassword === newPassword) {
            alert('새로운 비밀번호가 기존 비밀번호와 동일합니다 ❗');
            return;
        }

        if (!validatePassword(newPassword)) {
            alert('비밀번호는 8자리 이상이며 특수문자를 포함해야 합니다 ❗');
            return;
        }

        const updatedUser = { ...user2, password: newPassword };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === user2.id);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            setPasswordMessage('비밀번호 변경이 완료되었습니다!');
            setChangeCompleted(true);
        } else {
            console.error('users 배열에 사용자 정보를 찾을 수 없습니다:', user2);
        }
    };

    useEffect(() => {
        const changePopClearImg = document.querySelector('.account_change_popup_clear img');
        if (changeCompleted && changePopClearImg) {
            changePopClearImg.classList.add('completed');
        }
    }, [changeCompleted]);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleDeleteAccountClick = () => {
        const mainWarp = document.querySelector('.myInfo_main_warp');
        const deletePopup = document.querySelector('.delete_account_popup');
    
        if (mainWarp && deletePopup) {
            mainWarp.classList.add('blurred');
            deletePopup.classList.add('visible');
        }
    };
    
   

    const handleDeleteAccountSubmit = (e) => {
        e.preventDefault();
        const deleteInput = e.target.querySelector('.delete_account_popup .delete_account_popup_warp input');
        const confirmText = "탈퇴하겠습니다";
    
        if (!deleteInput || deleteInput.value.trim() !== confirmText) {
            if (!deleteInput) {
                alert("'탈퇴하겠습니다'를 입력해주세요");
            } else {
                alert("입력하신 내용이 '탈퇴하겠습니다'가 아닙니다.");
            }
            return;
        }
    
        // Confirmation passed, proceed with account deletion
        alert('그동안 매치포인트를 이용해주셔서 감사합니다.');
    
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.id !== user2.id);
    
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.removeItem('currentUser'); // 현재 유저 정보 삭제
    
        // 로그인 페이지로 이동
        navigate('../Match_login');
    };
    
    useEffect(() => {
        const deleteAccimg = document.querySelector('.delete_account_popup .delete_account_popup_warp img');
        const deletePopup = document.querySelector('.delete_account_popup');
    
        const applyStyles = () => {
            if (deletePopup && deletePopup.classList.contains('visible')) {
                deleteAccimg.style.transform = 'scale(1)';
                deleteAccimg.style.transition = 'all 0.5s ease';
            }
        };
    
        applyStyles(); // 최초 렌더링 시 한 번 호출
    
        // 클래스가 변경될 때마다 applyStyles 함수를 호출하도록 이벤트 리스너 추가
        const observer = new MutationObserver(applyStyles);
        observer.observe(deletePopup, { attributes: true, attributeFilter: ['class'] });
    
        return () => observer.disconnect(); // 컴포넌트가 언마운트되면 observer를 해제
    }, []);
    
    const logOut = () =>{
        navigate('../Match_login')
    }

    return (
        <div id="Match_MyInfo">
            <Logo_header />
            <div className="MyInfo_hd Match_MyInfo_hd">
                <div className="Match_MyInfo_hd_warp">
                    <h3>내 정보</h3>
                </div>
            </div>
            
            <div className="myInfo_main">
                <div className="delete_account_popup">
                    <div className="delete_account_popup_warp">
                        <h3>계정을 탈퇴하시겠어요?</h3>
                        <p>계정 탈퇴시 계정을 복구 하지 못합니다.<br/>
                        삭제시 사용자의 개인정보는 지워집니다.</p>
                        <img src={delete_pop_man} alt="delete_pop_man" />
                        <span>밑 입력창에 “탈퇴하겠습니다”를 입력하고<br/>탈퇴 버튼을 눌러주세요<br/>
                        계정 탈퇴 후 로그인 페이지로 이동됩니다.</span>
                        <form onSubmit={handleDeleteAccountSubmit}>
                            <input type="text" placeholder='탈퇴하겠습니다.' />
                            <button type='submit'>계정 탈퇴</button>
                        </form>
                    </div>
                    <span className="material-symbols-rounded cl" onClick={() => window.location.reload()}>
                        cancel
                    </span>
                </div>
                <div className={`account_change_popup ${isPopupVisible ? 'visible' : ''}`}>
                    <div className="account_change_popup_warp">
                        <div className="tabs">
                            <button 
                                className={activeTab === 'idChange' ? 'active' : ''}
                                onClick={() => setActiveTab('idChange')}
                            >
                                아이디 변경
                            </button>
                            <button 
                                className={activeTab === 'passwordChange' ? 'active' : ''}
                                onClick={() => setActiveTab('passwordChange')}
                            >
                                비밀번호 변경
                            </button>
                        </div>

                        {activeTab === 'idChange' && (
                            <form className='id_rechange' onSubmit={handleIdChange}>
                                <div className="old_id">
                                    <img src={MatchPoint_id_ic} alt="아이디 아이콘"/>
                                    <input
                                        type="text"
                                        placeholder="기존 아이디를 입력하세요"
                                        value={oldId}
                                        onChange={handleOldIdChange}
                                        required
                                    />
                                </div>
                                <div className="new_id">
                                    <img src={MatchPoint_id_ic} alt="아이디 아이콘"/>
                                    <input
                                        type="text"
                                        placeholder="새로운 아이디를 입력하세요"
                                        value={newId}
                                        onChange={handleNewIdChange}
                                        required
                                    />
                                </div>                            
                                {idError && <p className="error">{idError}</p>}
                                <button type="submit">아이디 변경</button>
                            </form>
                        )}

                        {activeTab === 'passwordChange' && (
                            <form className='pw_rechange' onSubmit={handlePasswordChange}>
                                
                                <div>   
                                    <img src={MatchPoint_pw_ic_lock} alt="비밀번호 아이콘"/>
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="기존 비밀번호를 입력하세요."
                                        value={oldPassword}
                                        onChange={handleOldPasswordChange}
                                        required
                                    />
                                    <img 
                                        className='show_hide' 
                                        src={showOldPassword ? MatchPoint_pw_ic_hide : MatchPoint_pw_ic_show} 
                                        alt="비밀번호 보기 아이콘"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    />
                                </div>
                                <div>
                                    <img src={MatchPoint_pw_ic_lock} alt="비밀번호 아이콘"/>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="새로운 비밀번호를 입력하세요."
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        required
                                    />
                                    <img 
                                        className='show_hide' 
                                        src={showNewPassword ? MatchPoint_pw_ic_hide : MatchPoint_pw_ic_show} 
                                        alt="비밀번호 보기 아이콘"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    />
                                </div>
                                {passwordMessage && <p className="error">{passwordMessage}</p>}
                                <button type="submit">비밀번호 변경</button>
                            </form>
                        )}
                    </div>
                    <span className="material-symbols-rounded cl" onClick={() => window.location.reload()}>
                        cancel
                    </span>
                </div>
               {/* 변경 완료 팝업 */}
                <div className={`account_change_popup_clear ${changeCompleted ? 'visible' : ''}`}>
                    <h4>감사합니다 {user2.name}님의<br/>아이디 및 비밀번호 변경이 완료되었습니다.<br/></h4>
                    <img
                        src={find_account_check}
                        alt="find_account_check"
                        className={changeCompleted ? 'completed' : ''}
                    />
                    <span className="material-symbols-rounded cl" onClick={() => window.location.reload()}>
                        cancel
                    </span>
                </div>
                
                <div className={`myInfo_main_warp ${isPopupVisible ? 'blurred' : ''}`}>
                    <div className="myInfo_main_profile">
                        <div className="myInfo_main_profile_warp">
                            <div className="myInfo_main_profile_lt">
                                <img src={Info_greenSmiling} alt='Info_greenSmiling' />
                            </div>
                            <div className="myInfo_main_profile_rt">
                                <h3>{user2.name}님</h3>
                                <h4>아이디 : {user2.id}</h4>
                                <div className="myInfo_main_profile_rt_box">
                                    <div className="myInfo_main_profile_rt_box_lt">
                                        <p>예약 횟수</p>
                                        <span>{reservationCount}회</span>
                                    </div>
                                    <div className="myInfo_main_profile_rt_box_rt">
                                        <p>예약 등급</p>
                                        <img src={gradeImage} alt='grade' />
                                        <span>{grade}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="feedback">
                            <span className="material-symbols-rounded" onClick={handleCloseFeedback}>
                                close
                            </span>
                            <form className="feedback_form" onSubmit={sendFeedback}>
                                <p>궁금한점 ㆍ 개선해야될점을<br />
                                    애기해주세요!</p>
                                <img src={Info_feedback_man} alt="Info_feedback_man" />
                                <div className="feedback_box">
                                    <input
                                        value={feedback}
                                        onChange={handleFeedbackChange}
                                        placeholder="여기에 피드백을 입력하세요!"
                                        required
                                    />
                                    <button type='submit'>
                                        <div className="svg-wrapper-1">
                                            <div className="svg-wrapper">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    height="24"
                                                >
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path
                                                        fill="currentColor"
                                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span>보내기</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="myInfo_menu">
                        <div className="myInfo_menu_warp">
                            <div className="item" onClick={togglePopup}>
                                <div className="item_warp account_change_mn">
                                    <p>계정 아이디 ㆍ 비밀번호 변경하기</p>
                                    <span className="material-symbols-rounded">
                                        arrow_forward_ios
                                    </span>
                                </div>
                            </div>
                            <div className="item" onClick={logOut}>
                                <div className="item_warp">
                                    <p>계정 로그아웃</p>
                                    <span className="material-symbols-rounded">
                                        arrow_forward_ios
                                    </span>
                                </div>
                            </div>
                           <div className="item delete_account" onClick={handleDeleteAccountClick}>
                                <div className="item_warp">
                                    <p>계정 탈퇴하기</p>
                                    <span className="material-symbols-rounded">
                                        arrow_forward_ios
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Match_MyInfo;
