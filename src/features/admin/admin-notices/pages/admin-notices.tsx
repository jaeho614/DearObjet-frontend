import { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Button, Input, SelectBox } from '../../../../shared/components/ui';

type NoticeTarget = 'MAIN' | 'PARTNER';
type NoticeStatus = '게시중' | '임시저장' | '숨김';

interface Notice {
  id: number;
  title: string;
  target: NoticeTarget;
  status: NoticeStatus;
  createdAt: string;
  content: string;
  isPinned: boolean;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    title: '8월 서비스 업데이트 안내',
    target: 'MAIN',
    status: '게시중',
    createdAt: '2025.08.28',
    content:
      'Dear Objet의 새로운 기능을 소개합니다. 이번 업데이트에서는 지도 페이지 개선, 클래스 예약 시스템 강화, 그리고 작가 포트폴리오 기능이 추가되었습니다.',
    isPinned: true,
  },
  {
    id: 2,
    title: '9월 정산 일정 공지',
    target: 'PARTNER',
    status: '게시중',
    createdAt: '2025.08.25',
    content: '이번 달 정산은 9월 10일에 진행됩니다.',
    isPinned: false,
  },
  {
    id: 3,
    title: '추석 연휴 고객센터 운영 안내',
    target: 'MAIN',
    status: '게시중',
    createdAt: '2025.08.20',
    content: '추석 연휴 기간 동안 고객센터 운영시간이 변경됩니다.',
    isPinned: false,
  },
  {
    id: 4,
    title: '작가 입점 심사 기준 변경 안내',
    target: 'PARTNER',
    status: '임시저장',
    createdAt: '2025.08.15',
    content: '2025년 9월부터 작가 심사 기준이 변경됩니다.',
    isPinned: false,
  },
  {
    id: 5,
    title: '개인정보처리방침 개정 안내',
    target: 'MAIN',
    status: '게시중',
    createdAt: '2025.08.10',
    content: '2025년 9월 1일부터 개인정보처리방침이 개정됩니다.',
    isPinned: false,
  },
];

const TARGET_STYLE: Record<NoticeTarget, string> = {
  MAIN: 'bg-blue-50 text-blue-600',
  PARTNER: 'bg-purple-50 text-purple-600',
};

const TARGET_LABEL: Record<NoticeTarget, string> = {
  MAIN: '메인',
  PARTNER: '파트너',
};

const STATUS_STYLE: Record<NoticeStatus, string> = {
  게시중: 'bg-emerald-50 text-emerald-600',
  임시저장: 'bg-amber-50 text-amber-600',
  숨김: 'bg-gray-100 text-gray-400',
};

type TabFilter = 'ALL' | NoticeTarget;

export const AdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tabFilter, setTabFilter] = useState<TabFilter>('ALL');
  const [keyword, setKeyword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState<NoticeTarget>('MAIN');
  const [editStatus, setEditStatus] = useState<NoticeStatus>('임시저장');
  const [editContent, setEditContent] = useState('');
  const [editPinned, setEditPinned] = useState(false);

  const selectedNotice = notices.find((n) => n.id === selectedId) ?? null;
  const isFormActive = isCreating || isEditing;

  const filteredNotices = notices.filter((n) => {
    const matchTab = tabFilter === 'ALL' || n.target === tabFilter;
    const matchSearch = n.title.includes(keyword);
    return matchTab && matchSearch;
  });

  const handleSelect = (notice: Notice) => {
    setSelectedId(notice.id);
    setIsCreating(false);
    setIsEditing(false);
    setEditTitle(notice.title);
    setEditTarget(notice.target);
    setEditStatus(notice.status);
    setEditContent(notice.content);
    setEditPinned(notice.isPinned);
  };

  const handleNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedId(-1);
    setEditTitle('');
    setEditTarget('MAIN');
    setEditStatus('임시저장');
    setEditContent('');
    setEditPinned(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isCreating) {
      if (selectedNotice) {
        handleSelect(selectedNotice);
      } else if (notices.length > 0) {
        handleSelect(notices[0]);
      }
      setIsCreating(false);
    } else {
      if (selectedNotice) {
        setEditTitle(selectedNotice.title);
        setEditTarget(selectedNotice.target);
        setEditStatus(selectedNotice.status);
        setEditContent(selectedNotice.content);
        setEditPinned(selectedNotice.isPinned);
      }
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    // TODO: API 연결
    if (isCreating) {
      const newNotice: Notice = {
        id: Date.now(),
        title: editTitle,
        target: editTarget,
        status: editStatus,
        createdAt: new Date()
          .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\. /g, '.')
          .replace('.', ''),
        content: editContent,
        isPinned: editPinned,
      };
      setNotices((prev) => [newNotice, ...prev]);
      setSelectedId(newNotice.id);
      setIsCreating(false);
    } else {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === selectedId
            ? {
                ...n,
                title: editTitle,
                target: editTarget,
                status: editStatus,
                content: editContent,
                isPinned: editPinned,
              }
            : n
        )
      );
      setIsEditing(false);
    }
    alert('저장되었습니다.');
  };

  const handleDelete = () => {
    if (!confirm('공지사항을 삭제하시겠습니까?')) return;
    const remaining = notices.filter((n) => n.id !== selectedId);
    setNotices(remaining);
    setIsEditing(false);
    if (remaining.length > 0) handleSelect(remaining[0]);
    else handleNew();
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* 리스트 패널 */}
      <section className="flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
        <header className="shrink-0 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">공지사항</h2>
            <button
              type="button"
              onClick={handleNew}
              className="flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
            >
              <Plus size={12} aria-hidden="true" />새 공지
            </button>
          </div>
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
              placeholder="공지 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 text-xs"
              aria-label="공지 검색"
            />
          </div>
        </div>

        {/* 탭 필터 */}
        <div className="flex shrink-0 gap-1 border-b px-4 py-2">
          {(['ALL', 'MAIN', 'PARTNER'] as TabFilter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTabFilter(tab)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                tabFilter === tab
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              {tab === 'ALL' ? '전체' : TARGET_LABEL[tab]}
            </button>
          ))}
        </div>

        {/* 리스트 */}
        <ul className="min-h-0 flex-1 overflow-y-auto" role="list">
          {filteredNotices.map((notice) => (
            <li key={notice.id}>
              <button
                type="button"
                className={`w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                  selectedId === notice.id
                    ? 'border-l-2 border-l-gray-900 bg-gray-50'
                    : ''
                }`}
                onClick={() => handleSelect(notice)}
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${TARGET_STYLE[notice.target]}`}
                  >
                    {TARGET_LABEL[notice.target]}
                  </span>
                  {notice.isPinned && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      고정
                    </span>
                  )}
                </div>
                <p className="truncate text-xs font-medium text-gray-800">
                  {notice.title}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {notice.createdAt}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 편집 패널 */}
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
        {selectedId === null && !isCreating ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            공지를 선택해주세요.
          </div>
        ) : (
          <>
            <header className="flex shrink-0 items-center justify-between border-b px-6 py-3">
              <h2 className="font-bold">
                {isCreating
                  ? '새 공지 작성'
                  : isEditing
                    ? '공지 수정'
                    : '공지 상세'}
              </h2>
              <div className="flex items-center gap-2">
                {!isFormActive && (
                  <Button
                    variant="secondaryDark"
                    size="small"
                    label="수정하기"
                    onClick={handleStartEdit}
                  />
                )}
                {isFormActive && (
                  <>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-md border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50"
                      >
                        <Trash2 size={12} aria-hidden="true" />
                        삭제
                      </button>
                    )}
                    <Button
                      variant="secondaryLight"
                      size="small"
                      label="취소"
                      onClick={handleCancel}
                    />
                    <Button
                      variant="secondaryDark"
                      size="small"
                      label="저장"
                      onClick={handleSave}
                    />
                  </>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* 제목 */}
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-xs text-gray-500"
                  htmlFor="notice-title"
                >
                  제목 <span className="text-red-400">*</span>
                </label>
                <Input
                  id="notice-title"
                  type="text"
                  readOnly={!isFormActive}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full ${
                    !isFormActive
                      ? 'border-transparent bg-gray-50 text-gray-700'
                      : ''
                  }`}
                />
              </div>

              {/* 노출 대상 + 상태 */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="mb-1.5 block text-xs text-gray-500"
                    htmlFor="notice-target"
                  >
                    노출 대상 <span className="text-red-400">*</span>
                  </label>
                  <SelectBox
                    options={[
                      { value: 'MAIN', label: '메인 (고객)' },
                      { value: 'PARTNER', label: '파트너' },
                    ]}
                    value={editTarget}
                    disabled={!isFormActive}
                    onChange={(v) => setEditTarget(v as NoticeTarget)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs text-gray-500"
                    htmlFor="notice-status"
                  >
                    상태
                  </label>
                  <SelectBox
                    options={[
                      { value: '게시중', label: '게시중' },
                      { value: '임시저장', label: '임시저장' },
                      { value: '숨김', label: '숨김' },
                    ]}
                    value={editStatus}
                    disabled={!isFormActive}
                    onChange={(v) => setEditStatus(v as NoticeStatus)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 내용 */}
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-xs text-gray-500"
                  htmlFor="notice-content"
                >
                  내용 <span className="text-red-400">*</span>
                </label>
                {/* TODO: Tiptap 에디터로 교체 */}
                <textarea
                  id="notice-content"
                  readOnly={!isFormActive}
                  className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors ${
                    isFormActive
                      ? 'border-gray-200 focus:ring-1 focus:ring-gray-400'
                      : 'border-transparent bg-gray-50 text-gray-700'
                  }`}
                  rows={10}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                {isFormActive && (
                  <p className="mt-1 text-right text-[10px] text-gray-400">
                    {editContent.length}자
                  </p>
                )}
              </div>

              {/* 상단 고정 */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={editPinned}
                  disabled={!isFormActive}
                  onClick={() => setEditPinned((prev) => !prev)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    editPinned ? 'bg-gray-900' : 'bg-gray-200'
                  } ${!isFormActive ? 'cursor-default' : ''}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      editPinned ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <div>
                  <p className="text-sm text-gray-700">상단 고정</p>
                  <p className="text-xs text-gray-400">
                    목록 최상단에 고정됩니다
                  </p>
                </div>
              </div>
            </div>

            {/* 상태 배지 미리보기 */}
            {(editTitle || editStatus) && (
              <div className="shrink-0 border-t px-6 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${TARGET_STYLE[editTarget]}`}
                  >
                    {TARGET_LABEL[editTarget]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[editStatus]}`}
                  >
                    {editStatus}
                  </span>
                  {editPinned && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      고정
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
