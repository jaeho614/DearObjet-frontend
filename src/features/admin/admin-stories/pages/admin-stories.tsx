import { useState } from 'react';
import {
  ContentManagePanel,
  type ContentItem,
} from '../../admin-posts/components/content-manage-panel';

const MOCK_STORIES: ContentItem[] = [
  {
    id: 1,
    title: '여름 신상 입고 소식',
    author: '솜다람잡화점',
    createdAt: '2025.08.26',
    status: 'VISIBLE',
    content: '여름 신상품이 입고되었습니다.',
  },
  {
    id: 2,
    title: '도자기 전시회 안내',
    author: '청자도예',
    createdAt: '2025.08.23',
    status: 'VISIBLE',
    content: '9월 도자기 전시회를 개최합니다.',
  },
  {
    id: 3,
    title: '블라인드된 스토리',
    author: '어쩌구소품샵',
    createdAt: '2025.08.19',
    status: 'BLIND',
    content: '블라인드 처리된 스토리입니다.',
  },
];

export const AdminStories = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_STORIES);

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
      title="스토리 관리"
      items={items}
      onDelete={handleDelete}
      onBlind={handleBlind}
      onUnblind={handleUnblind}
    />
  );
};
