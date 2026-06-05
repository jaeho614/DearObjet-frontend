import { useState } from 'react';
import { useLocation } from 'react-router';
import { Search } from 'lucide-react';
import { Button } from '../../shared/components/ui';

export interface ContentItem {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  status: 'VISIBLE' | 'BLIND';
  content?: string;
  imageUrl?: string;
}

interface ContentManagePanelProps {
  title: string;
  items: ContentItem[];
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onBlind: (id: number) => void;
  onUnblind: (id: number) => void;
}

const STATUS_STYLE: Record<ContentItem['status'], string> = {
  VISIBLE: 'bg-emerald-50 text-emerald-600',
  BLIND: 'bg-red-50 text-red-400',
};

const STATUS_LABEL: Record<ContentItem['status'], string> = {
  VISIBLE: '게시중',
  BLIND: '블라인드',
};

export const ContentManagePanel = ({
  title,
  items,
  isLoading = false,
  onDelete,
  onBlind,
  onUnblind,
}: ContentManagePanelProps) => {
  const location = useLocation();
  const initialKeyword =
    (location.state as { searchKeyword?: string } | null)?.searchKeyword ?? '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = items.filter(
    (item) => item.title.includes(keyword) || item.author.includes(keyword)
  );

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  const handleDelete = () => {
    if (!selectedItem) return;
    if (!confirm(`"${selectedItem.title}"을(를) 삭제하시겠습니까?`)) return;
    onDelete(selectedItem.id);
    setSelectedId(null);
  };

  const handleBlindToggle = () => {
    if (!selectedItem) return;
    if (selectedItem.status === 'BLIND') {
      onUnblind(selectedItem.id);
    } else {
      if (!confirm(`"${selectedItem.title}"을(를) 블라인드 처리하시겠습니까?`))
        return;
      onBlind(selectedItem.id);
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* 왼쪽: 목록 */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white">
        <header className="shrink-0 border-b px-4 py-3">
          <h2 className="font-bold">{title}</h2>
          <p className="mt-0.5 text-xs text-gray-400">총 {filtered.length}개</p>
        </header>

        {/* 검색 */}
        <div className="shrink-0 border-b px-4 py-2">
          <div className="relative flex items-center">
            <Search
              className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              className="w-full rounded-md border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="제목, 작성자 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label={`${title} 검색`}
            />
          </div>
        </div>

        {/* 목록 */}
        <ul className="min-h-0 flex-1 overflow-y-auto" role="list">
          {isLoading ? (
            <li className="py-10 text-center text-sm text-gray-400">
              불러오는 중...
            </li>
          ) : filtered.length === 0 ? (
            <li className="py-10 text-center text-sm text-gray-400">
              검색 결과가 없습니다.
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                    selectedId === item.id
                      ? 'border-l-2 border-l-gray-900 bg-gray-50'
                      : ''
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[item.status]}`}
                    >
                      {STATUS_LABEL[item.status]}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {item.author} · {item.createdAt}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 오른쪽: 상세 */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white">
        {selectedItem === null ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            항목을 선택해주세요.
          </div>
        ) : (
          <>
            <header className="flex shrink-0 items-center justify-between border-b px-6 py-3">
              <h2 className="font-bold">상세 보기</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondaryLight"
                  className="px-3 py-1.5 text-xs"
                  label={
                    selectedItem.status === 'BLIND'
                      ? '블라인드 해제'
                      : '블라인드'
                  }
                  onClick={handleBlindToggle}
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* 상태 배지 */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[selectedItem.status]}`}
                >
                  {STATUS_LABEL[selectedItem.status]}
                </span>
              </div>

              {/* 제목 */}
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {selectedItem.title}
              </h3>

              {/* 메타 정보 */}
              <p className="mb-4 text-xs text-gray-400">
                {selectedItem.author} · {selectedItem.createdAt}
              </p>

              {/* 이미지 */}
              {selectedItem.imageUrl && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full object-cover"
                  />
                </div>
              )}

              {/* 내용 */}
              {selectedItem.content && (
                <div className="whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                  {selectedItem.content}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
