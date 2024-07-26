import './FindPw.css';

function FindPw({ FindPw_txt }) {
    const onClickBtn = () => {
        // activeTab 상태를 localStorage에 저장
        localStorage.setItem('activeTab', 1);
        // 페이지 리로드
        window.location.reload();
    };

    return (
        <button className='FindPw' onClick={onClickBtn}>
            {FindPw_txt}
            <span className="material-symbols-rounded">
                arrow_back_ios
            </span>
        </button>
    );
}

export default FindPw;