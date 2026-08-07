import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button, Input } from '../../../../shared/components/ui';
import { useKakaoMap } from '../../../map/hooks/use-kakao-map';
import type {
  KakaoCustomOverlay,
  KakaoMap,
  KakaoMarker,
  KakaoLatLng,
} from '../../../map/types/kakao-types';

interface ShopPending {
  id: number;
  name: string;
  category: string;
  phone: string;
  address: string;
}

const MOCK_PENDING_SHOPS: ShopPending[] = [
  {
    id: 1,
    name: '솜다람잡화점',
    category: '패브릭',
    phone: '010-1234-5678',
    address: '서울특별시 마포구 연남동 223-45',
  },
  {
    id: 2,
    name: '청자도예',
    category: '도자기',
    phone: '010-9876-5432',
    address: '서울특별시 성동구 성수동2가 289-1',
  },
  {
    id: 3,
    name: '어쩌구소품샵',
    category: '목공',
    phone: '010-5555-1234',
    address: '서울특별시 용산구 이태원동 119-1',
  },
  {
    id: 4,
    name: '달빛공방',
    category: '가죽',
    phone: '010-2222-3333',
    address: '서울특별시 강남구 신사동 555-6',
  },
];

interface RegisteredShop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface AdminKakaoMap extends KakaoMap {
  setLevel: (level: number) => void;
}

interface AdminKakaoCustomOverlay extends KakaoCustomOverlay {
  getPosition: () => KakaoLatLng;
}

interface AdminKakaoAddressSearchResult {
  x: string;
  y: string;
  address_name: string;
}

interface AdminKakaoGeocoder {
  addressSearch: (
    address: string,
    callback: (result: AdminKakaoAddressSearchResult[], status: string) => void
  ) => void;
}

interface AdminKakaoServicesStatus {
  OK: string;
  ZERO_RESULT: string;
  ERROR: string;
}

interface AdminKakaoMapsServices {
  Geocoder: new () => AdminKakaoGeocoder;
  Status: AdminKakaoServicesStatus;
}

const DEFAULT_LAT = 37.5665;
const DEFAULT_LNG = 126.978;
const DEFAULT_LEVEL = 8;

const createPreviewMarkerElement = () => {
  const el = document.createElement('div');
  el.style.cssText = 'width: 36px; height: 50px; position: relative;';
  el.innerHTML = `
    <div style="
      width: 36px;
      height: 36px;
      background-color: #FF3B30;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
    <div style="
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 14px solid #FF3B30;
      margin: 0 auto;
      margin-top: -2px;
    "></div>
  `;
  return el;
};

export const AdminMap = () => {
  const { isLoaded } = useKakaoMap();
  const [keyword, setKeyword] = useState('');
  const [selectedShop, setSelectedShop] = useState<ShopPending | null>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [mapError, setMapError] = useState(false);
  const [registeredShops, setRegisteredShops] = useState<RegisteredShop[]>([]);
  const [isPreviewConfirmed, setIsPreviewConfirmed] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<AdminKakaoMap | null>(null);
  const previewMarkerRef = useRef<AdminKakaoCustomOverlay | null>(null);
  const registeredMarkersRef = useRef<
    (KakaoMarker | AdminKakaoCustomOverlay)[]
  >([]);

  const filtered = MOCK_PENDING_SHOPS.filter(
    (s) => s.name.includes(keyword) || s.address.includes(keyword)
  );

  useEffect(() => {
    if (!isLoaded) return;

    const initMap = () => {
      if (!mapRef.current) return;
      try {
        mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
          level: DEFAULT_LEVEL,
        }) as AdminKakaoMap;
      } catch {
        setMapError(true);
      }
    };

    initMap();
  }, [isLoaded]);

  const handleSelect = (shop: ShopPending) => {
    setSelectedShop(shop);
    setLat('');
    setLng('');
    setIsPreviewConfirmed(false);

    previewMarkerRef.current?.setMap(null);
    previewMarkerRef.current = null;

    if (!isLoaded) return;

    const geocoder = new (
      window.kakao.maps as unknown as { services: AdminKakaoMapsServices }
    ).services.Geocoder();

    geocoder.addressSearch(shop.address, (result, status) => {
      const services = (
        window.kakao.maps as unknown as { services: AdminKakaoMapsServices }
      ).services;
      if (status === services.Status.OK) {
        setLat(result[0].y);
        setLng(result[0].x);
      }
    });
  };

  const handlePreview = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('올바른 위도/경도 값을 입력해주세요.');
      return;
    }
    if (latNum < -90 || latNum > 90) {
      alert('위도는 -90 ~ 90 사이여야 합니다.');
      return;
    }
    if (lngNum < -180 || lngNum > 180) {
      alert('경도는 -180 ~ 180 사이여야 합니다.');
      return;
    }
    if (!mapInstanceRef.current) return;

    previewMarkerRef.current?.setMap(null);

    const position = new window.kakao.maps.LatLng(latNum, lngNum);

    previewMarkerRef.current = new window.kakao.maps.CustomOverlay({
      position,
      content: createPreviewMarkerElement(),
      map: mapInstanceRef.current,
      yAnchor: 1,
    }) as AdminKakaoCustomOverlay;

    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(4);

    setIsPreviewConfirmed(true);
  };

  const handleRegister = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // TODO: API 연결 - POST /api/v1/admin/shops/:id/location { lat: latNum, lng: lngNum }

    if (previewMarkerRef.current) {
      registeredMarkersRef.current.push(previewMarkerRef.current);
      previewMarkerRef.current = null;
    }

    const updated = [
      ...registeredShops.filter((s) => s.id !== selectedShop!.id),
      {
        id: selectedShop!.id,
        name: selectedShop!.name,
        lat: latNum,
        lng: lngNum,
      },
    ];
    setRegisteredShops(updated);

    alert(`${selectedShop!.name} 위치가 등록되었습니다.`);
    setSelectedShop(null);
    setLat('');
    setLng('');
    setIsPreviewConfirmed(false);
  };

  const handleCancel = () => {
    previewMarkerRef.current?.setMap(null);
    previewMarkerRef.current = null;
    setSelectedShop(null);
    setLat('');
    setLng('');
    setIsPreviewConfirmed(false);
  };

  const handleLatChange = (value: string) => {
    setLat(value);
    setIsPreviewConfirmed(false);
    previewMarkerRef.current?.setMap(null);
    previewMarkerRef.current = null;
  };

  const handleLngChange = (value: string) => {
    setLng(value);
    setIsPreviewConfirmed(false);
    previewMarkerRef.current?.setMap(null);
    previewMarkerRef.current = null;
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* 왼쪽: 대기 목록 */}
      <section className="flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
        <header className="shrink-0 border-b px-4 py-3">
          <h2 className="font-bold">소품샵 등록 대기</h2>
          <p className="mt-0.5 text-xs text-gray-400">총 {filtered.length}개</p>
        </header>

        {/* 검색 */}
        <div className="shrink-0 border-b px-4 py-2">
          <div className="relative flex items-center">
            <Search
              className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="상호명, 주소 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 text-xs"
              aria-label="소품샵 검색"
            />
          </div>
        </div>

        {/* 목록 */}
        <ul className="min-h-0 flex-1 overflow-y-auto" role="list">
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-sm text-gray-400">
              검색 결과가 없습니다.
            </li>
          ) : (
            filtered.map((shop) => (
              <li key={shop.id}>
                <button
                  type="button"
                  className={`w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                    selectedShop?.id === shop.id
                      ? 'border-l-2 border-l-gray-900 bg-gray-50'
                      : ''
                  }`}
                  onClick={() => handleSelect(shop)}
                >
                  <p className="text-xs font-medium text-gray-800">
                    {shop.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-gray-400">
                    {shop.address}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 오른쪽: 상세 폼 + 지도 */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        {/* 상세 폼 */}
        <section className="shrink-0 rounded-xl bg-white px-6 py-5">
          {selectedShop === null ? (
            <p className="py-[122px] text-center text-sm text-gray-400">
              소품샵을 선택해주세요.
            </p>
          ) : (
            <>
              <h2 className="mb-4 font-bold">위치 등록</h2>

              {/* 소품샵 기본 정보 */}
              <div className="mb-5 grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg bg-gray-50 px-4 py-3">
                {[
                  { label: '상호명', value: selectedShop.name },
                  { label: '카테고리', value: selectedShop.category },
                  { label: '전화번호', value: selectedShop.phone },
                  { label: '주소', value: selectedShop.address },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="w-16 shrink-0 text-xs text-gray-400">
                      {label}
                    </span>
                    <span className="text-xs text-gray-700">{value}</span>
                  </div>
                ))}
              </div>

              {/* 위도/경도 입력 + 위치 확인 버튼 */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label
                    className="mb-1.5 block text-xs text-gray-500"
                    htmlFor="input-lat"
                  >
                    위도 (Latitude) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="input-lat"
                    type="number"
                    placeholder="예) 37.5665"
                    value={lat}
                    onChange={(e) => handleLatChange(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="mb-1.5 block text-xs text-gray-500"
                    htmlFor="input-lng"
                  >
                    경도 (Longitude) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="input-lng"
                    type="number"
                    placeholder="예) 126.9780"
                    value={lng}
                    onChange={(e) => handleLngChange(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="secondaryLight"
                  size="small"
                  label="위치 확인"
                  onClick={handlePreview}
                />
              </div>

              {/* 위치 확인 안내 */}
              <p className="mt-2 text-xs text-gray-400">
                {isPreviewConfirmed
                  ? '✓ 지도에서 위치를 확인했습니다. 등록 버튼을 눌러 완료하세요.'
                  : '위도/경도 입력 후 위치 확인 버튼을 눌러 지도에서 확인하세요.'}
              </p>

              {/* 취소/등록 버튼 */}
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="secondaryLight"
                  size="small"
                  label="취소"
                  onClick={handleCancel}
                />
                <Button
                  variant="secondaryDark"
                  size="small"
                  label="등록"
                  disabled={!isPreviewConfirmed}
                  onClick={handleRegister}
                />
              </div>
            </>
          )}
        </section>

        {/* 카카오맵 */}
        <section className="min-h-0 flex-1 overflow-hidden rounded-xl bg-white">
          {mapError ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              지도를 불러올 수 없습니다.
            </div>
          ) : (
            <div ref={mapRef} className="h-full w-full" />
          )}
        </section>
      </div>
    </div>
  );
};
