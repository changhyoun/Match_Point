import './Relogin.css'
import { useNavigate } from 'react-router-dom'

function Relogin({ Relogin_txt }) {

    const onClickBtn = () => {
        window.location.reload();
    };

    return (
        <button className='Relogin' onClick={onClickBtn}>
            {Relogin_txt}
            <span class="material-symbols-rounded">
                refresh
            </span>
            
        </button>
    );
}

export default Relogin;