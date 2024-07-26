import './Footer.css'
import { Link } from 'react-router-dom';


function Footer() {
    return (
        <footer className='Footer'>

            <Link to={"../Main"} className='Footer_reservation'>

                    <span className="material-symbols-rounded">
                        home
                    </span>
                    <p>홈</p>

            </Link>

            <Link to={"../All_Court"} className='Footer_reservation'>
                
                    <span className="material-symbols-rounded">
                        calendar_month
                    </span>
                    <p>코트 예약</p>
                
            </Link>
                <Link to={"../Account_Reservation"} className='Footer_record'>
                
                <span class="material-symbols-rounded">
                    schedule
                </span>
                    <p>예약 내역</p>
            
                </Link>
                <Link to={"../Match_MyInfo"} className='Footer_info'>
                
                <span className="material-symbols-rounded">
                    person
                </span>
                    <p>내 정보</p>
                
                </Link>
        </footer>
            
        
    );
}

export default Footer;