import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button, Input, SelectBox } from '../../../../shared/components/ui';

import {
  useGetAdminNoticeQuery,
  useUpdateAdminNoticeMutation,
  useDeleteAdminNoticeMutation,
} from '../../api/admin-api';
import {
  TARGET_LABEL,
  TARGET_STYLE,
  CATEGORY_LABEL,
  STATUS_LABEL,
  STATUS_STYLE,
} from '../constants/admin-notices-constants';
import type {
  NoticeTarget,
  NoticeCategory,
  NoticeStatus,
  NoticeDetailPanelProps,
  NoticeForm,
} from '../types/admin-notices-types';

export const NoticeDetailPanel = ({
  noticeId,
  onDeleted,
}: NoticeDetailPanelProps) => {
  const { data: notice, isLoading } = useGetAdminNoticeQuery(noticeId);
  const [updateAdminNotice] = useUpdateAdminNoticeMutation();
  const [deleteAdminNotice] = useDeleteAdminNoticeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<NoticeForm>({
    title: '',
    target: 'USER',
    category: 'GENERAL',
    status: 'DRAFT',
    body: '',
    pinned: false,
  });

  const startEdit = () => {
    if (!notice) return;
    setForm({
      title: notice.title,
      target: notice.target,
      category: notice.category,
      status: notice.status,
      body: notice.body,
      pinned: notice.pinned,
    });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!notice) return;
    try {
      await updateAdminNotice({
        noticeId: notice.noticeId,
        body: form,
      }).unwrap();
      setIsEditing(false);
      alert('저장되었습니다.');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!notice) return;
    if (!confirm(`"${notice.title}"을(를) 삭제하시겠습니까?`)) return;
    try {
      await deleteAdminNotice(notice.noticeId).unwrap();
      onDeleted();
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const displayTarget = isEditing ? form.target : (notice?.target ?? 'USER');
  const displayStatus = isEditing ? form.status : (notice?.status ?? 'DRAFT');
  const displayPinned = isEditing ? form.pinned : (notice?.pinned ?? false);

  if (isLoading || !notice) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-3">
        <h2 className="font-bold">{isEditing ? '공지 수정' : '공지 상세'}</h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="secondaryDark"
              size="small"
              label="수정하기"
              onClick={startEdit}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-md border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50"
              >
                <Trash2 size={12} aria-hidden="true" />
                삭제
              </button>
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
            readOnly={!isEditing}
            value={isEditing ? form.title : notice.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={`w-full ${
              !isEditing ? 'border-transparent bg-gray-50 text-gray-700' : ''
            }`}
          />
        </div>

        {/* 노출 대상 + 상태 */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">
              노출 대상 <span className="text-red-400">*</span>
            </label>
            {isEditing ? (
              <SelectBox
                options={[
                  { value: 'USER', label: '메인 (고객)' },
                  { value: 'ARTIST_SHOP', label: '파트너' },
                ]}
                value={form.target}
                onChange={(v) =>
                  setForm((p) => ({ ...p, target: v as NoticeTarget }))
                }
                className="w-full"
              />
            ) : (
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {TARGET_LABEL[notice.target]}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">상태</label>
            {isEditing ? (
              <SelectBox
                options={[
                  { value: 'PUBLISHED', label: '게시중' },
                  { value: 'DRAFT', label: '임시저장' },
                  { value: 'HIDDEN', label: '숨김' },
                ]}
                value={form.status}
                onChange={(v) =>
                  setForm((p) => ({ ...p, status: v as NoticeStatus }))
                }
                className="w-full"
              />
            ) : (
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {STATUS_LABEL[notice.status]}
              </div>
            )}
          </div>
        </div>

        {/* 카테고리 */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs text-gray-500">카테고리</label>
          {isEditing ? (
            <SelectBox
              options={[
                { value: 'IMPORTANT', label: '주요공지' },
                { value: 'GENERAL', label: '일반' },
                { value: 'FESTIVAL', label: '축제' },
                { value: 'CULTURE_PERFORMANCE', label: '문화공연' },
                { value: 'EVENT', label: '이벤트' },
              ]}
              value={form.category}
              onChange={(v) =>
                setForm((p) => ({ ...p, category: v as NoticeCategory }))
              }
              className="w-full"
            />
          ) : (
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {CATEGORY_LABEL[notice.category]}
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="mb-4">
          <label
            className="mb-1.5 block text-xs text-gray-500"
            htmlFor="notice-body"
          >
            내용 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="notice-body"
            readOnly={!isEditing}
            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors ${
              isEditing
                ? 'border-gray-200 focus:ring-1 focus:ring-gray-400'
                : 'border-transparent bg-gray-50 text-gray-700'
            }`}
            rows={10}
            value={isEditing ? form.body : notice.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
          />
          {isEditing && (
            <p className="mt-1 text-right text-[10px] text-gray-400">
              {form.body.length}자
            </p>
          )}
        </div>

        {/* 상단 고정 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={displayPinned}
            disabled={!isEditing}
            onClick={() => setForm((p) => ({ ...p, pinned: !p.pinned }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              displayPinned ? 'bg-gray-900' : 'bg-gray-200'
            } ${!isEditing ? 'cursor-default' : ''}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                displayPinned ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <div>
            <p className="text-sm text-gray-700">상단 고정</p>
            <p className="text-xs text-gray-400">목록 최상단에 고정됩니다</p>
          </div>
        </div>
      </div>

      {/* 상태 배지 미리보기 */}
      <div className="shrink-0 border-t px-6 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${TARGET_STYLE[displayTarget]}`}
          >
            {TARGET_LABEL[displayTarget]}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[displayStatus]}`}
          >
            {STATUS_LABEL[displayStatus]}
          </span>
          {displayPinned && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
              고정
            </span>
          )}
        </div>
      </div>
    </>
  );
};
