import { useState } from 'react';

import { Button, Input, SelectBox } from '../../../../shared/components/ui';

import { useCreateAdminNoticeMutation } from '../../api/admin-api';
import {
  TARGET_LABEL,
  TARGET_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
  DEFAULT_FORM,
} from '../constants/admin-notices-constants';
import type {
  NoticeTarget,
  NoticeCategory,
  NoticeStatus,
  NoticeCreatePanelProps,
  NoticeForm,
} from '../types/admin-notices-types';

export const NoticeCreatePanel = ({ onCancel }: NoticeCreatePanelProps) => {
  const [createAdminNotice] = useCreateAdminNoticeMutation();
  const [form, setForm] = useState<NoticeForm>(DEFAULT_FORM);

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!form.body.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    try {
      await createAdminNotice({
        title: form.title,
        target: form.target,
        category: form.category,
        status: form.status,
        body: form.body,
        pinned: form.pinned,
      }).unwrap();
      alert('저장되었습니다.');
      onCancel();
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-3">
        <h2 className="font-bold">새 공지 작성</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondaryLight"
            size="small"
            label="취소"
            onClick={onCancel}
          />
          <Button
            variant="secondaryDark"
            size="small"
            label="저장"
            onClick={handleSave}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* 제목 */}
        <div className="mb-4">
          <label
            className="mb-1.5 block text-xs text-gray-500"
            htmlFor="new-notice-title"
          >
            제목 <span className="text-red-400">*</span>
          </label>
          <Input
            id="new-notice-title"
            type="text"
            placeholder="제목을 입력하세요."
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full"
          />
        </div>

        {/* 노출 대상 + 상태 */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">
              노출 대상 <span className="text-red-400">*</span>
            </label>
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
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">상태</label>
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
          </div>
        </div>

        {/* 카테고리 */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs text-gray-500">카테고리</label>
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
        </div>

        {/* 내용 */}
        <div className="mb-4">
          <label
            className="mb-1.5 block text-xs text-gray-500"
            htmlFor="new-notice-body"
          >
            내용 <span className="text-red-400">*</span>
          </label>
          {/* TODO: Tiptap 에디터로 교체 */}
          <textarea
            id="new-notice-body"
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-gray-400"
            rows={10}
            placeholder="내용을 입력하세요."
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
          />
          <p className="mt-1 text-right text-[10px] text-gray-400">
            {form.body.length}자
          </p>
        </div>

        {/* 상단 고정 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.pinned}
            onClick={() => setForm((p) => ({ ...p, pinned: !p.pinned }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.pinned ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                form.pinned ? 'translate-x-4' : 'translate-x-0.5'
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
            className={`rounded-full px-2 py-0.5 text-[10px] ${TARGET_STYLE[form.target]}`}
          >
            {TARGET_LABEL[form.target]}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[form.status]}`}
          >
            {STATUS_LABEL[form.status]}
          </span>
          {form.pinned && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
              고정
            </span>
          )}
        </div>
      </div>
    </>
  );
};
