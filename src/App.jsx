import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/Responsive.css';
import './App.css';
import Loading from './pages/Loading';


const Integrated_login = lazy(() => import('./pages/Integrated_login'));
const Match_login = lazy(() => import('./pages/Match_login'));
const Match_Signup = lazy(() => import('./pages/Match_Signup'));
const Match_login_forgot = lazy(() => import('./pages/Match_login_forgot'));
const Main = lazy(() => import('./pages/Main'));
const All_Product = lazy(() => import('./pages/All_Product'));
const All_Court = lazy(() => import('./pages/All_Court'));
const CourtDetail = lazy(() => import('./pages/CourtDetail'));
const Account_Reservation = lazy(() => import('./pages/Account_Reservation'));
const Match_MyInfo = lazy(() => import('./pages/Match_MyInfo'));
const Not_Found = lazy(() => import('./pages/Not_Found'));

function App() {
    const BASE_URL = import.meta.env.BASE_URL;
    
    useEffect(() => {
        const handleOrientationChange = () => {
            if (window.matchMedia("(orientation: landscape)").matches) {
                document.getElementById('landscape-warning').style.display = 'block';
            } else {
                document.getElementById('landscape-warning').style.display = 'none';
            }
        };

        window.addEventListener('resize', handleOrientationChange);
        handleOrientationChange(); // 초기 실행을 위해 호출

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, []);

    return (
        <Router basename={BASE_URL}>
            <div className='App'>
                <div id="landscape-warning" className="landscape-warning" style={{ display: 'none' }}>
                    <span className="material-symbols-rounded">screen_lock_rotation</span>
                    <p>가로모드는 지원이 안되어있습니다.<br/>세로모드로 변경해주세요.</p>
                </div>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<Integrated_login />} />
                        <Route path="/Match_login" element={<Match_login />} />
                        <Route path="/Match_Signup" element={<Match_Signup />} />
                        <Route path="/Match_login_forgot" element={<Match_login_forgot />} />
                        <Route path="/Main" element={<Main />} />
                        <Route path="/All_Product" element={<All_Product />} />
                        <Route path="/All_Court" element={<All_Court />} />
                        <Route path="/court/:id" element={<CourtDetail />} />
                        <Route path="/Account_Reservation" element={<Account_Reservation />} />
                        <Route path="/Match_MyInfo" element={<Match_MyInfo />} />
                        <Route path="*" element={<Not_Found />} /> {/* 정의되지 않은 모든 경로에 대해 NotFound 컴포넌트를 표시 */}
                        
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;