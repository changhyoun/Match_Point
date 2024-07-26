import './Logo_header.css'
import { logo_white } from '../pages/Images';

function Logo_header() {


    return (
        <div id='Logo_header'>
            <img src={logo_white} alt="logo_white" />
        </div>  
    );
}

export default Logo_header;