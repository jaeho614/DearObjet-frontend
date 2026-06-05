import { useState } from 'react';

import { SettingsSection } from './settings-section';

interface FooterSnsData {
  kakao: string | null;
  instagram: string | null;
  email: string | null;
}

const MOCK_SNS: FooterSnsData = {
  kakao: 'https://pf.kakao.com/_dearobjet',
  instagram: null,
  email: 'contact@dearobjet.com',
};

const SNS_FIELDS: {
  key: keyof FooterSnsData;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'kakao',
    label: '카카오 채널',
    placeholder: 'https://pf.kakao.com/...',
  },
  {
    key: 'instagram',
    label: '인스타그램',
    placeholder: 'https://instagram.com/...',
  },
  { key: 'email', label: '이메일', placeholder: 'contact@example.com' },
];

export const SettingsFooterSection = () => {
  const [data, setData] = useState<FooterSnsData>(MOCK_SNS);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FooterSnsData>(data);

  const hasValue = Object.values(data).some((v) => v !== null);

  const handleEdit = () => {
    setEditData({ ...data });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({ ...data });
    setIsEditing(false);
  };

  const handleSave = () => {
    const cleaned: FooterSnsData = {
      kakao: editData.kakao?.trim() || null,
      instagram: editData.instagram?.trim() || null,
      email: editData.email?.trim() || null,
    };
    setData(cleaned);
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  const handleDelete = () => {
    if (!confirm('SNS 링크를 모두 삭제하시겠습니까?')) return;

    const empty: FooterSnsData = { kakao: null, instagram: null, email: null };
    setData(empty);
    setEditData(empty);
    setIsEditing(false);
  };

  return (
    <SettingsSection
      title="Footer SNS 링크"
      isEditing={isEditing}
      hasValue={hasValue}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    >
      <div className="flex flex-col gap-4">
        {SNS_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label
              className="mb-1.5 block text-xs text-gray-500"
              htmlFor={`sns-${key}`}
            >
              {label}
            </label>
            <input
              id={`sns-${key}`}
              type="text"
              readOnly={!isEditing}
              placeholder={isEditing ? placeholder : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
                isEditing
                  ? 'border-gray-200 focus:ring-1 focus:ring-gray-400'
                  : 'border-transparent bg-gray-50 text-gray-700'
              }`}
              value={
                isEditing ? (editData[key] ?? '') : (data[key] ?? '미등록')
              }
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};
