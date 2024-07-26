import React from 'react';
import './Integrated_login.css';
import { Match_log_ball } from './Images';
import { Link } from 'react-router-dom';

function Integrated_login() {   
    return (
        <div id="Integrated_login">
            <div className="Integrated_login_warp">
                <Link to={"./Match_login"}>
                    <button className='Match_log'>
                        <img src={Match_log_ball} alt="Match_log_ball" /> Match Point 계정 로그인
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Integrated_login;