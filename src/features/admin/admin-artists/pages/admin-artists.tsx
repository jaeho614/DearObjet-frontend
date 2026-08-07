import { useState } from 'react';
import {
  ContentManagePanel,
  type ContentItem,
} from '../../admin-posts/components/content-manage-panel';

const MOCK_ARTISTS: ContentItem[] = [
  {
    id: 1,
    title: '이도윤',
    author: '도자기 / 목공',
    createdAt: '2025.06.10',
    status: 'VISIBLE',
    content: '도자기와 목공예를 전문으로 하는 작가입니다.',
  },
  {
    id: 2,
    title: '박하늘',
    author: '가죽 공예',
    createdAt: '2025.07.05',
    status: 'VISIBLE',
    content: '가죽 공예 전문 작가입니다.',
  },
  {
    id: 3,
    title: '최민준',
    author: '패브릭',
    createdAt: '2025.07.20',
    status: 'BLIND',
    content: '블라인드 처리된 작가입니다.',
  },
];

export const AdminArtists = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_ARTISTS);

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
      title="작가 관리"
      items={items}
      onDelete={handleDelete}
      onBlind={handleBlind}
      onUnblind={handleUnblind}
    />
  );
};
