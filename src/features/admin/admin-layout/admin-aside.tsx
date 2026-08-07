import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MapPin,
  FileText,
  Image,
  CalendarDays,
  Megaphone,
  Settings,
} from 'lucide-react';

import DearObjectWhiteLogo from '../../../assets/dear-objet-white-logo.svg';

import { AdminAsideTab } from './admin-aside-tab';
import { ADMIN_ROUTES } from '../constants/admin-constants';

export const AdminAside = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const asideRef = useRef<HTMLElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  const handleScroll = () => {
    const el = asideRef.current;
    if (!el) return;
    el.classList.add('is-scrolling');
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove('is-scrolling');
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleClick = (path: string) => {
    setActiveMenu(path);
    navigate(path);
  };

  const isActive = (path: string) => activeMenu.startsWith(path);

  return (
    <aside
      ref={asideRef}
      onScroll={handleScroll}
      className="aside-scroll flex flex-col overflow-y-auto bg-black pb-[2.875rem] pl-[2.375rem] pr-[3.375rem] pt-[3.25rem] text-white"
    >
      {/* 로고 */}
      <section className="flex items-center gap-2 text-[1.1875rem]">
        <img
          src={DearObjectWhiteLogo}
          alt="dear objet 로고"
          onClick={() => navigate('/')}
          className="cursor-pointer"
        />
        <h2 className="font-abril">admin</h2>
      </section>

      {/* Manage */}
      <nav className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="font-abril text-sm">Manage</h2>

        {/* 대시보드 */}
        <AdminAsideTab
          icon={LayoutDashboard}
          label="대시보드"
          className={
            isActive(ADMIN_ROUTES.DASHBOARD) ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick(ADMIN_ROUTES.DASHBOARD)}
        />

        {/* 회원 */}
        <div className="flex flex-col gap-5">
          <AdminAsideTab
            icon={Users}
            label="회원 관리"
            className={
              isActive(ADMIN_ROUTES.MEMBERS) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.MEMBERS)}
          />
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col gap-5">
          <AdminAsideTab
            icon={MapPin}
            label="지도/소품샵 등록"
            className={
              isActive(ADMIN_ROUTES.MAP) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.MAP)}
          />
          <AdminAsideTab
            icon={FileText}
            label="포스트 관리"
            className={
              isActive(ADMIN_ROUTES.POSTS) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.POSTS)}
          />
          <AdminAsideTab
            icon={Image}
            label="스토리 관리"
            className={
              isActive(ADMIN_ROUTES.STORIES) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.STORIES)}
          />
          <AdminAsideTab
            icon={CalendarDays}
            label="클래스 관리"
            className={
              isActive(ADMIN_ROUTES.CLASSES) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.CLASSES)}
          />
          <AdminAsideTab
            icon={UserCheck}
            label="작가 관리"
            className={
              isActive(ADMIN_ROUTES.ARTISTS) ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick(ADMIN_ROUTES.ARTISTS)}
          />
        </div>
      </nav>

      {/* Configuration */}
      <section className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="font-abril text-sm">Configuration</h2>
        <AdminAsideTab
          icon={Megaphone}
          label="공지사항 관리"
          className={
            isActive(ADMIN_ROUTES.NOTICES) ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick(ADMIN_ROUTES.NOTICES)}
        />
        <AdminAsideTab
          icon={Settings}
          label="메인 페이지 설정"
          className={
            isActive(ADMIN_ROUTES.MAIN_SETTINGS)
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick(ADMIN_ROUTES.MAIN_SETTINGS)}
        />
        <AdminAsideTab
          icon={Settings}
          label="디자인 설정"
          className={
            isActive(ADMIN_ROUTES.DESIGN_SETTINGS)
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick(ADMIN_ROUTES.DESIGN_SETTINGS)}
        />
      </section>
    </aside>
  );
};
