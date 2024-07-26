import React, { useEffect } from 'react';
import { kakao_location } from '../pages/Images';
import keys from '../../keys/keys';

const KakaoMap = ({ latitude, longitude }) => {
  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          resolve(window.kakao);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${keys.kakaoJavApiKey}&autoload=false`;
        script.async = true;
        script.onload = () => resolve(window.kakao);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadKakaoMapScript()
      .then((kakao) => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };

          const map = new kakao.maps.Map(container, options);

          // 마커 이미지 설정
          const markerImage = new kakao.maps.MarkerImage(
            kakao_location, // 이미지 경로
            new kakao.maps.Size(60, 60), // 이미지 크기
            { offset: new kakao.maps.Point(15, 15) } // 이미지 위치 설정
          );

          // 마커 설정
          const markerPosition = new kakao.maps.LatLng(latitude, longitude);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage, // 마커 이미지 설정
          });

          marker.setMap(map);

          // 확대 버튼 추가
          const zoomInButton = document.createElement('button');
          zoomInButton.innerHTML = '🔎';
          zoomInButton.style.position = 'absolute';
          zoomInButton.style.backgroundColor = 'white'
          zoomInButton.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.15)'
          zoomInButton.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.15)'
          zoomInButton.style.color = '#77B850'
          zoomInButton.style.padding = '3px 5px';
          zoomInButton.style.border ='none';
          zoomInButton.style.top = '10px';
          zoomInButton.style.left = '10px';
          zoomInButton.style.cursor= 'pointer';
          zoomInButton.style.zIndex = '100';
          zoomInButton.style.outline = 'none';
          zoomInButton.style.width = '25px';
          zoomInButton.style.height = '25px';
          zoomInButton.style.display = 'flex';
          zoomInButton.style.alignItems = 'center';
          zoomInButton.style.justifyContent = 'center';

          zoomInButton.style.borderRadius = '50%'
          zoomInButton.onclick = () => {
            const level = map.getLevel() - 1;
            if (level >= 1) {
              map.setLevel(level);
            }
          };
          container.appendChild(zoomInButton);

          // 축소 버튼 추가
          const zoomOutButton = document.createElement('button');
          zoomOutButton.innerHTML = '➖';
          zoomOutButton.style.position = 'absolute';
          zoomOutButton.style.backgroundColor = 'white'
          zoomOutButton.style.border ='none';
          zoomOutButton.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.15)'
          zoomOutButton.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.15)'
          zoomOutButton.style.color = '#77B850'
          zoomOutButton.style.borderRadius = '50%'
          zoomOutButton.style.padding = '3px 5px';
          zoomOutButton.style.top = '50px';
          zoomOutButton.style.left = '10px';
          zoomOutButton.style.cursor= 'pointer';
          zoomOutButton.style.outline = 'none';
          zoomOutButton.style.zIndex = '100';
          zoomOutButton.style.width = '25px';
          zoomOutButton.style.height = '25px';
          zoomOutButton.style.display = 'flex';
          zoomOutButton.style.alignItems = 'center';
          zoomOutButton.style.justifyContent = 'center';

          zoomOutButton.onclick = () => {
            const level = map.getLevel() + 1;
            if (level <= 9) { // 최대 지도 레벨인 9까지
              map.setLevel(level);
            }
          };
          container.appendChild(zoomOutButton);
        });
      })
      .catch((error) => {
        console.error('Failed to load Kakao Map script', error);
      });

    // Clean up script on component unmount
    return () => {
      const script = document.querySelector(`script[src*="dapi.kakao.com/v2/maps/sdk.js"]`);
      if (script) {
        script.remove();
      }
    };
  }, [latitude, longitude]);

  return <div id="map" style={{ position: 'relative' }}></div>;
};

export default KakaoMap;