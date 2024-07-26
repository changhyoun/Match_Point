// 회원가입페이지
import React, { useState, useRef } from 'react';
import './Match_Signup.css';
import { login_back } from './Images';
import BackArrow from '../components/BackArrow';
import { Link } from 'react-router-dom';
import {
    MatchPoint_logo,
    MatchPoint_id_ic,
    MatchPoint_again_input_ic,
    MatchPoint_birth_ic,
    MatchPoint_name_ic,
    MatchPoint_pw_ic_lock,
    MatchPoint_pw_ic_show,
    MatchPoint_pw_ic_hide,
    MatchPoint_signup_popup,
    MatchPoint_number_ic
} from './Images';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Match_Signup() {
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [birthError, setBirthError] = useState(false);
    const [pwMismatchError, setPwMismatchError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const [duplicationChecked, setDuplicationChecked] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [pwRuleError, setPwRuleError] = useState(false);
    const [showPwRule, setShowPwRule] = useState(true);
    const [signupName, setSignupName] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [formattedPhone, setFormattedPhone] = useState('');
    const [phoneFormatError, setPhoneFormatError] = useState(false);
    const [selectedBirthDate, setSelectedBirthDate] = useState(null);

    const idInputRef = useRef(null);
    const pwInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const againPwInputRef = useRef(null);
    const phoneInputRef = useRef(null);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const idInput = idInputRef.current?.value.trim();
        const pwInput = pwInputRef.current?.value.trim();
        const name = nameInputRef.current?.value.trim();
        const birth = selectedBirthDate ? formatDate(selectedBirthDate) : null;
        const againPw = againPwInputRef.current?.value.trim();
        const phone = formattedPhone;

        let hasError = false;

        if (!name) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        if (!birth) {
            setBirthError(true);
            hasError = true;
        } else {
            setBirthError(false);
        }

        if (!phone || phoneFormatError) {
            setPhoneError(true);
            hasError = true;
        } else {
            setPhoneError(false);
        }

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

        if (pwInput !== againPw) {
            setPwMismatchError(true);
            setPasswordMatch(false);
            hasError = true;
        } else {
            setPwMismatchError(false);
            setPasswordMatch(true);
        }

        if (pwInput.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(pwInput)) {
            setPwRuleError(true);
            setShowPwRule(false);
            hasError = true;
        } else {
            setPwRuleError(false);
            setShowPwRule(true);
        }

        if (!duplicationChecked) {
            setIsIdAvailable(null);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const phoneExists = users.some(user => user.phoneNumber === phone);

        if (phoneExists) {
            alert(`${phone}로 가입한 내역이 있습니다.`);
            return;
        }

        const userData = {
            id: idInput,
            password: pwInput,
            name: name,
            birth: birth,
            phoneNumber: phone
        };

        // 새 사용자 데이터 추가
        users.push(userData);
        // 업데이트된 사용자 데이터 저장
        localStorage.setItem('users', JSON.stringify(users));

        setSignupName(name);
        setSignupSuccess(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkIdAvailability = () => {
        const idInput = idInputRef.current?.value.trim();
        if (idInput) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.id === idInput);
            if (userExists) {
                setIsIdAvailable(false);
                setDuplicationChecked(false);
            } else {
                setIsIdAvailable(true);
                setDuplicationChecked(true);
            }
        } else {
            setIsIdAvailable(null);
            setDuplicationChecked(false);
        }
    };

    const handlePhoneChange = (event) => {
        const phone = event.target.value.replace(/[^\d]/g, '');
        setFormattedPhone(formatPhoneNumber(phone));
        setPhoneFormatError(phone.length !== 11);
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const formatted = phone
            .replace(/(\d{3})(\d{1,4})?(\d{1,4})?/, (match, p1, p2, p3) => {
                let parts = [p1];
                if (p2) parts.push(`-${p2}`);
                if (p3) parts.push(`-${p3}`);
                return parts.join('');
            });
        return formatted;
    };

    return (
        <div id="Match_Signup">
            <img src={login_back} alt="login_back" />
            <div className="Match_Signup_warp">
                <Link to={'/Match_login'}>
                    <BackArrow BackArrow_txt={"로그인 페이지"} />
                </Link>
                <div className={`signup_popup ${signupSuccess ? 'active' : ''}`}>
                    <img src={MatchPoint_signup_popup} alt="MatchPoint_signup_popup" />
                    <p>환영합니다. <span>{signupName}님</span><br />
                    회원가입이 완료되셨습니다.</p>
                    <Link to={"/Match_login"}>
                        로그인하러 가보실까요?
                    </Link>
                </div>
                <div className={`Match_Signup_warp_inner ${signupSuccess ? 'dimmed' : ''}`}>
                    <img src={MatchPoint_logo} alt="MatchPoint_logo" />
                    <form onSubmit={handleSubmit}>
                        <div className="name">
                            <input className='name_input' type="text" placeholder='이름을 입력하세요.' name="name" ref={nameInputRef} />
                            <img src={MatchPoint_name_ic} alt="MatchPoint_name_ic" />
                            {nameError && <p>이름을 입력하세요 ❗</p>}
                        </div>
                        <div className="birth">
                            <DatePicker
                                className='birth_input'
                                selected={selectedBirthDate}
                                onChange={(date) => setSelectedBirthDate(date)}
                                dateFormat="yyyy-MM-dd"
                                showYearDropdown
                                showMonthDropdown
                                placeholderText='생년월일을 선택하세요.'
                                name="birth"
                                dropdownMode="select"
                                popperPlacement="bottom"
                                onFocus={(e) => e.target.blur()} // 모바일에서 키보드 자판 방지
                            />
                            <img src={MatchPoint_birth_ic} alt="MatchPoint_birth_ic" />
                            {birthError && <p>생년월일을 선택하세요 ❗</p>}
                        </div>
                        <div className="phone">
                            <input
                                className={`phone_input ${phoneFormatError ? 'error' : ''}`}
                                type="tel"
                                placeholder='휴대폰번호를 입력하세요.'
                                name="phone"
                                ref={phoneInputRef}
                                value={formattedPhone}
                                onChange={handlePhoneChange}
                            />
                            <img src={MatchPoint_number_ic} alt="MatchPoint_id_ic" />
                            {phoneError && <p>휴대폰번호를 입력하세요 ❗</p>}
                            {phoneFormatError && <p>휴대폰번호가 올바르지 않습니다.</p>}
                        </div>
                        <div className="id">
                            <input
                                className='id_input'
                                type="text"
                                placeholder='아이디를 입력하세요.'
                                name="id"
                                ref={idInputRef}
                                onBlur={checkIdAvailability}
                            />
                            <img src={MatchPoint_id_ic} alt="MatchPoint_id_ic" />
                            {isIdAvailable === true && <p>👌 사용 가능한 아이디입니다.</p>}
                            {isIdAvailable === false && <p>⚠️ 이미 사용 중인 아이디입니다.</p>}
                            {idError && <p>아이디를 입력하세요 ❗</p>}
                        </div>
                        <div className="pw">
                            <input
                                className='pw_input'
                                type={showPassword ? "text" : "password"}
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
                            {showPwRule && <h6>🔑 비밀번호 생성 규칙 : 8자리 이상 ㆍ특수문자 포함 </h6>}
                            {pwRuleError && <p>8자리 이상, 특수문자를 포함해야 합니다 ⚠️</p>}
                            {pwError && <p>비밀번호를 입력하세요 ❗</p>}
                        </div>
                        <div className="pw_again">
                            <input
                                className={`pw_again_input ${pwMismatchError ? 'error' : ''}`}
                                type="password"
                                placeholder='비밀번호를 다시 한번 입력하세요.'
                                name="againPw"
                                ref={againPwInputRef}
                            />
                            <img src={MatchPoint_pw_ic_lock} alt='MatchPoint_pw_ic_lock' />
                            {pwMismatchError && <p>비밀번호가 맞지 않아요 😰</p>}
                            {passwordMatch && <img id='sock' className='match_icon' src={MatchPoint_again_input_ic} alt='MatchPoint_again_input_ic' />}
                        </div>
                        <button type='submit'>회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Match_Signup;
