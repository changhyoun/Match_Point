import './Refind.css'
import { useNavigate } from 'react-router-dom'

function Refind({ Refind_txt }) {

    const onClickBtn = () => {
        window.location.reload();
    };

    return (
        <button className='Refind' onClick={onClickBtn}>
            {Refind_txt}
            <span className="material-symbols-rounded">
                arrow_back_ios
            </span>
            
        </button>
    );
}

export default Refind;