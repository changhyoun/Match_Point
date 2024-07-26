import './BackArrow.css'
import { useNavigate } from 'react-router-dom'

function BackArrow({ BackArrow_txt }) {



    return (
        <button className='BackArrow' >
            <span className="material-symbols-rounded">
                arrow_back_ios
            </span>
            {BackArrow_txt}
        </button>
    );
}

export default BackArrow;