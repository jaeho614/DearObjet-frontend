import { useState } from 'react';
import { Input } from '../../../../shared/components/ui';
import { SettingsSection } from './settings-section';

interface BusinessData {
  companyName: string;
  ceo: string;
  address: string;
  businessNumber: string;
  mailOrderNumber: string;
  phone: string;
}

const MOCK_BUSINESS: BusinessData = {
  companyName: '(주)디어오브제 주식회사',
  ceo: '최재호',
  address: '서울특별시 강남구 테헤란로 000, 0층',
  businessNumber: '000-00-00000',
  mailOrderNumber: '제2024-서울강남-0000호',
  phone: '0000-0000',
};

const BUSINESS_FIELDS: { key: keyof BusinessData; label: string }[] = [
  { key: 'companyName', label: '회사명' },
  { key: 'ceo', label: '대표이사' },
  { key: 'address', label: '주소' },
  { key: 'businessNumber', label: '사업자등록번호' },
  { key: 'mailOrderNumber', label: '통신판매업신고번호' },
  { key: 'phone', label: '대표 전화' },
];

export const SettingsBusinessSection = () => {
  const [data, setData] = useState<BusinessData>(MOCK_BUSINESS);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<BusinessData>(data);

  const hasValue = Object.values(data).some((v) => v !== '');

  const handleEdit = () => {
    setEditData({ ...data });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({ ...data });
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API 연결
    setData({ ...editData });
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  return (
    <SettingsSection
      title="사업자 정보"
      isEditing={isEditing}
      hasValue={hasValue}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {BUSINESS_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label
              className="mb-1.5 block text-xs text-gray-500"
              htmlFor={`biz-${key}`}
            >
              {label}
            </label>
            <Input
              id={`biz-${key}`}
              type="text"
              readOnly={!isEditing}
              value={isEditing ? editData[key] : data[key] || '미등록'}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className={`w-full ${
                !isEditing ? 'border-transparent bg-gray-50 text-gray-700' : ''
              }`}
            />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};
