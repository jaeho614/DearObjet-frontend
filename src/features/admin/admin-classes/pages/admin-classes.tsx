import { useState } from 'react';
import {
  ContentManagePanel,
  type ContentItem,
} from '../../admin-posts/components/content-manage-panel';

const MOCK_CLASSES: ContentItem[] = [
  {
    id: 1,
    title: '도자기 입문 클래스',
    author: '청자도예',
    createdAt: '2025.08.20',
    status: 'VISIBLE',
    content: '도자기 만들기 원데이 클래스입니다.',
  },
  {
    id: 2,
    title: '가죽 공예 클래스',
    author: '달빛공방',
    createdAt: '2025.08.18',
    status: 'VISIBLE',
    content: '가죽으로 카드지갑을 만드는 클래스입니다.',
  },
  {
    id: 3,
    title: '패브릭 파우치 만들기',
    author: '솜다람잡화점',
    createdAt: '2025.08.15',
    status: 'BLIND',
    content: '패브릭으로 파우치를 만드는 클래스입니다.',
  },
];

export const AdminClasses = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_CLASSES);

  const handleDelete = (id: number) => {
    // TODO: API 연결
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBlind = (id: number) => {
    // TODO: API 연결
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'BLIND' } : item))
    );
  };

  const handleUnblind = (id: number) => {
    // TODO: API 연결
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'VISIBLE' } : item
      )
    );
  };

  return (
    <ContentManagePanel
      title="클래스 관리"
      items={items}
      onDelete={handleDelete}
      onBlind={handleBlind}
      onUnblind={handleUnblind}
    />
  );
};
