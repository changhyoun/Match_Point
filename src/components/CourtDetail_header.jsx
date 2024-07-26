import './CourtDetail_header.css'
import { logo_white } from '../pages/Images';
import BackArrow from './BackArrow';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CourtDetail_header() {
    const navigate = useNavigate();


    
    return (
        <div id='CourtDetail_header'>
            <Link to={'/All_Court'}>
                <BackArrow />
            </Link>
            <img src={logo_white} alt="logo_white" />
            
            {/* 빈 공간용 */}
            <p></p>
            
        </div>  
    );
}

export default CourtDetail_header;