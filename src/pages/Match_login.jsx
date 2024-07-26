import React, { useState, useRef, useEffect } from 'react';
import './Match_login.css';
import { login_back } from './Images';
import BackArrow from '../components/BackArrow';
import Relogin from '../components/Relogin';

import { 
    MatchPoint_logo, 
    MatchPoint_id_ic, 
    MatchPoint_pw_ic_lock, 
    MatchPoint_pw_ic_show, 
    MatchPoint_pw_ic_hide, 
    find_account_cancel
} from './Images';
import { Link, useNavigate } from 'react-router-dom';

function Match_login() {
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const idInputRef = useRef(null);
    const pwInputRef = useRef(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        if (loginFailed) {
            const notFindImage = document.querySelector('.Match_login_forgot_popup_not img')
            notFindImage.classList.add('rotate')
        }
    }, [loginFailed]);


    const handleSubmit = (event) => {
        event.preventDefault();

        const idInput = idInputRef.current?.value.trim();
        const pwInput = pwInputRef.current?.value.trim();

        let hasError = false;

        if (!idInput) {
            setIdError(true);
            hasError = true;
        } else {
            setIdError(false);
        }

        if (!pwInput) {
            setPwError(true);
            hasError = true;
        } else {
            setPwError(false);
        }

        if (hasError) {
            // 입력되지 않은 항목이 있을 때 처리
            return;
        }

        // 로컬 스토리지에서 사용자 데이터 확인
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.id === idInput && user.password === pwInput);

        if (user) {
            // 현재 사용자 정보를 로컬 스토리지에 저장
            localStorage.setItem('currentUser', JSON.stringify(user));
            // 로그인 성공 시 /Main 페이지로 이동
            navigate('/Main');
        } else {
            // 로그인 실패 시 상태 변경
            setLoginFailed(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div id="Match_login">
            <img src={login_back} alt="login_back" />
            <div className="Match_login_warp">
                <Link to={'/'}>
                    <BackArrow BackArrow_txt={"통합 로그인 페이지로"}/>
                </Link>
                
                {/* 아이디/비밀번호 로그인 실패 팝업 */}
                {loginFailed && (
                    <div className="Match_login_forgot_popup_not Match_login_forgot_popup">
                        <div className="Match_login_forgot_popup_not_inner">
                            <Relogin Relogin_txt={"로그인 페이지로 이동"} />
                            <img className='notFindImage' src={find_account_cancel} alt="find_account_check" />
                            <p>아이디ㆍ비밀번호가
                            일치 하지 않습니다 ❗</p>
                        </div>
                    </div>
                )}
                
                <div className="Match_login_warp_inner">
                    <img src={MatchPoint_logo} alt="MatchPoint_logo" />
                    <form onSubmit={handleSubmit}>
                        <div className="id">
                            <input 
                                className='id_input' 
                                type="text" 
                                placeholder='아이디를 입력하세요.' 
                                name="id" 
                                ref={idInputRef} 
                            />
                            <img src={MatchPoint_id_ic} alt="MatchPoint_id_ic" />
                            <p className={idError ? 'error-visible' : ''}>아이디를 입력하세요 ❗</p>
                        </div>
                        <div className="pw">
                            <input 
                                className='pw_input' 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='비밀번호를 입력하세요.' 
                                name="password" 
                                ref={pwInputRef} 
                            />
                            <img src={MatchPoint_pw_ic_lock} alt='MatchPoint_pw_ic_lock' />
                            <img 
                                src={showPassword ? MatchPoint_pw_ic_hide : MatchPoint_pw_ic_show} 
                                alt='Toggle Password' 
                                onClick={togglePasswordVisibility} 
                            />
                            <p className={pwError ? 'error-visible' : ''}>비밀번호를 입력하세요 ❗</p>
                        </div>
                        <button type='submit'>로그인</button>
                    </form>
                    <div className="Match_login_find_up">
                        <Link to={'../Match_login_forgot'}>
                        </Link>
                        <Link to={"../Match_Signup"}>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Match_login;