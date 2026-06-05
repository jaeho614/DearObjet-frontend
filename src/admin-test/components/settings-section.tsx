import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  isEditing: boolean;
  hasValue: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

export const SettingsSection = ({
  title,
  isEditing,
  hasValue,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  children,
}: SettingsSectionProps) => {
  return (
    <section className="rounded-xl bg-white px-6 py-5">
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <h2 className="font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              {hasValue && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-md border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50"
                >
                  삭제하기
                </button>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
              >
                저장하기
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
            >
              {hasValue ? '수정하기' : '등록하기'}
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};
