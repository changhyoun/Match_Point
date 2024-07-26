
import './Not_Found.css';
import { page_not_found } from './Images';
import { Link } from 'react-router-dom';


function Not_Found() {

   
    return (
        <div id="Not_Found">
            <img src={page_not_found} alt="page_not_found" />
            <p>페이지가 유효하지 않아요 😂</p>
            <Link to='/Match_login'>
                <button className="Not_Found_btn">
                    로그인 페이지로 <span class="material-symbols-rounded">arrow_forward_ios</span>
                </button>
            </Link>
            
        </div>
    );
}

export default Not_Found;