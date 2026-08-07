import { useState } from 'react';
import { SettingsSection } from './settings-section';

const MOCK_TERMS: string | null = null;

export const SettingsTermsSection = () => {
  const [terms, setTerms] = useState<string | null>(MOCK_TERMS);
  const [isEditing, setIsEditing] = useState(false);
  const [editTerms, setEditTerms] = useState(terms ?? '');

  const hasValue = terms !== null && terms.trim() !== '';

  const handleEdit = () => {
    setEditTerms(terms ?? '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTerms(terms ?? '');
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API 연결
    setTerms(editTerms.trim() || null);
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  const handleDelete = () => {
    if (!confirm('이용약관을 삭제하시겠습니까?')) return;
    // TODO: API 연결
    setTerms(null);
    setEditTerms('');
    setIsEditing(false);
  };

  return (
    <SettingsSection
      title="이용약관"
      isEditing={isEditing}
      hasValue={hasValue}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    >
      {/* TODO: Tiptap 에디터로 교체 */}
      {isEditing ? (
        <>
          <textarea
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-gray-400"
            rows={12}
            value={editTerms}
            onChange={(e) => setEditTerms(e.target.value)}
            placeholder="이용약관 내용을 입력하세요."
          />
          <p className="mt-1 text-right text-[10px] text-gray-400">
            {editTerms.length}자
          </p>
        </>
      ) : (
        <div className="min-h-[3rem] whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-2.5 text-sm leading-relaxed text-gray-700">
          {terms ?? (
            <span className="text-gray-400">등록된 이용약관이 없습니다.</span>
          )}
        </div>
      )}
    </SettingsSection>
  );
};
