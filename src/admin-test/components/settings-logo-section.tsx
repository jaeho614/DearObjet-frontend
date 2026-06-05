import { useRef, useState, type ChangeEvent } from 'react';

import { SettingsSection } from './settings-section';

interface LogoData {
  logoUrl: string;
  brandName: string;
}

const MOCK_LOGO_DATA: LogoData = {
  logoUrl: '',
  brandName: 'Dear Objet',
};

export const SettingsLogoSection = () => {
  const [data, setData] = useState<LogoData>(MOCK_LOGO_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(
    data.logoUrl
  );
  const [editBrandName, setEditBrandName] = useState(data.brandName ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasValue = !!(data.logoUrl || data.brandName);

  const handleEdit = () => {
    setEditLogoPreview(data.logoUrl);
    setEditBrandName(data.brandName ?? '');
    setEditLogoFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditLogoPreview(data.logoUrl);
    setEditBrandName(data.brandName ?? '');
    setEditLogoFile(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _file = editLogoFile;
    setData({ logoUrl: editLogoPreview ?? '', brandName: editBrandName });
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditLogoFile(file);
    setEditLogoPreview(URL.createObjectURL(file));
  };

  return (
    <SettingsSection
      title="로고 / 상호"
      isEditing={isEditing}
      hasValue={hasValue}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="flex items-center gap-8">
        {/* 로고 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 ${
              isEditing ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {editLogoPreview ? (
              <img
                src={editLogoPreview}
                alt="로고"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400">
                {isEditing ? '클릭하여 업로드' : '미등록'}
              </span>
            )}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] text-gray-400 hover:text-gray-600"
            >
              이미지 변경
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 상호명 */}
        <div className="flex-1">
          <label
            className="mb-1.5 block text-xs text-gray-500"
            htmlFor="brand-name"
          >
            상호명
          </label>
          <input
            id="brand-name"
            type="text"
            readOnly={!isEditing}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
              isEditing
                ? 'border-gray-200 focus:ring-1 focus:ring-gray-400'
                : 'border-transparent bg-gray-50 text-gray-700'
            }`}
            value={isEditing ? editBrandName : (data.brandName ?? '미등록')}
            onChange={(e) => setEditBrandName(e.target.value)}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
