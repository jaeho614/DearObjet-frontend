import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const MOCK_SIGNUP_DATA = [
  { month: '3월', customer: 72, artist: 16, shop: 10 },
  { month: '4월', customer: 85, artist: 20, shop: 10 },
  { month: '5월', customer: 103, artist: 25, shop: 15 },
  { month: '6월', customer: 91, artist: 22, shop: 14 },
  { month: '7월', customer: 118, artist: 28, shop: 16 },
  { month: '8월', customer: 103, artist: 24, shop: 16 },
];

const MOCK_RECENT_MEMBERS = [
  {
    id: 1,
    name: '김지수',
    email: 'jisoo@gmail.com',
    role: 'CUSTOMER',
    joinedAt: '2025.08.30',
    status: '활성',
  },
  {
    id: 2,
    name: '이도윤',
    email: 'dylee@naver.com',
    role: 'ARTIST',
    joinedAt: '2025.08.29',
    status: '활성',
  },
  {
    id: 3,
    name: '솜다람잡화점',
    email: 'somdaram@shop.com',
    role: 'SHOP',
    joinedAt: '2025.08.28',
    status: '승인대기',
  },
  {
    id: 4,
    name: '박하늘',
    email: 'sky@kakao.com',
    role: 'CUSTOMER',
    joinedAt: '2025.08.27',
    status: '활성',
  },
  {
    id: 5,
    name: '청자도예',
    email: 'celadon@art.kr',
    role: 'SHOP',
    joinedAt: '2025.08.26',
    status: '승인대기',
  },
];

const ROLE_STYLE: Record<string, string> = {
  CUSTOMER: 'bg-blue-50 text-blue-600',
  ARTIST: 'bg-purple-50 text-purple-600',
  SHOP: 'bg-emerald-50 text-emerald-600',
};

const STATUS_STYLE: Record<string, string> = {
  활성: 'text-emerald-500',
  승인대기: 'text-amber-500',
  정지: 'text-red-500',
};

type Period = '주' | '월' | '년';

export const AdminDashboard = () => {
  const [period, setPeriod] = useState<Period>('월');

  return (
    <div className="flex flex-col gap-5">
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '전체 회원', value: '4,821', change: '+143', up: true },
          { label: '전체 소품샵 회원', value: '218', change: '+12', up: true },
          { label: '전체 작가 회원', value: '531', change: '+28', up: true },
          { label: '클래스 예약', value: '1,092', change: '-3%', up: false },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-white px-5 py-4">
            <p className="mb-2 text-xs text-gray-400">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p
              className={`mt-1 text-xs ${card.up ? 'text-emerald-500' : 'text-red-400'}`}
            >
              이번달 {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* 차트 + 처리 대기 */}
      <div className="grid grid-cols-[1fr_18rem] gap-4">
        {/* 신규 회원가입 차트 */}
        <div className="rounded-xl bg-white px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">신규 회원가입 추이</h3>
            <div className="flex gap-1">
              {(['주', '월', '년'] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    period === p
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={MOCK_SIGNUP_DATA}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorArtist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: '0.5px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
              />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              <Area
                type="monotone"
                dataKey="customer"
                name="일반회원"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="url(#colorCustomer)"
                dot={{ r: 3, fill: '#3b82f6' }}
              />
              <Area
                type="monotone"
                dataKey="artist"
                name="작가"
                stroke="#a855f7"
                strokeWidth={1.5}
                fill="url(#colorArtist)"
                dot={{ r: 3, fill: '#a855f7' }}
              />
              <Area
                type="monotone"
                dataKey="shop"
                name="소품샵"
                stroke="#10b981"
                strokeWidth={1.5}
                fill="url(#colorShop)"
                dot={{ r: 3, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 처리 대기 */}
        <div className="rounded-xl bg-white px-5 py-5">
          <h3 className="mb-4 font-semibold text-gray-800">처리 대기</h3>
          <div className="flex flex-col gap-3">
            {[
              {
                label: '소품샵 승인 대기',
                sub: '신규 입점 신청',
                count: 5,
                color: 'bg-amber-400',
              },
              {
                label: '작가 승인 대기',
                sub: '신규 입점 신청',
                count: 8,
                color: 'bg-blue-400',
              },
              {
                label: '콘텐츠 신고',
                sub: '리뷰 / 포스트',
                count: 3,
                color: 'bg-red-400',
              },
              {
                label: '정산 미처리',
                sub: '이번달 정산',
                count: 2,
                color: 'bg-purple-400',
              },
              {
                label: '소품샵 등록 대기',
                sub: '소품샵 위치 등록',
                count: 2,
                color: 'bg-green-400',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${item.color}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-700">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
                <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500">
                  {item.count}건
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 가입 회원 */}
      <div className="rounded-xl bg-white px-6 py-5">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h3 className="font-semibold text-gray-800">최근 가입 회원</h3>
        </div>
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b text-center text-xs text-gray-400">
              <th className="w-[20%] py-2 font-normal">이름</th>
              <th className="w-[30%] py-2 font-normal">이메일</th>
              <th className="w-[15%] py-2 font-normal">역할</th>
              <th className="w-[20%] py-2 font-normal">가입일</th>
              <th className="w-[15%] py-2 font-normal">상태</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RECENT_MEMBERS.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-50 text-center last:border-0 hover:bg-gray-50"
              >
                <td className="py-2.5 text-gray-800">{m.name}</td>
                <td className="py-2.5 text-gray-500">{m.email}</td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${ROLE_STYLE[m.role]}`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="py-2.5 text-xs text-gray-400">{m.joinedAt}</td>
                <td className={`py-2.5 text-xs ${STATUS_STYLE[m.status]}`}>
                  {m.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
