import { useRef, useState, type ChangeEvent } from 'react';
import { Input } from '../../../../shared/components/ui';
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
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(
    data.logoUrl || null
  );
  const [editBrandName, setEditBrandName] = useState(data.brandName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasValue = !!(data.logoUrl || data.brandName);

  const handleEdit = () => {
    setEditLogoPreview(data.logoUrl || null);
    setEditBrandName(data.brandName);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditLogoPreview(data.logoUrl || null);
    setEditBrandName(data.brandName);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API 연결 - 로고 이미지 S3 업로드 후 URL 저장
    setData({ logoUrl: editLogoPreview ?? '', brandName: editBrandName });
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: API 연결 시 file을 업로드 로직에 사용
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
        {/* 로고 업로드 영역 */}
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
              <span className="text-center text-xs text-gray-400">
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
          <Input
            id="brand-name"
            type="text"
            readOnly={!isEditing}
            value={isEditing ? editBrandName : data.brandName || '미등록'}
            onChange={(e) => setEditBrandName(e.target.value)}
            className={`w-full ${
              !isEditing ? 'border-transparent bg-gray-50 text-gray-700' : ''
            }`}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
