import { useState } from 'react';
import {
  ContentManagePanel,
  type ContentItem,
} from '../components/content-manage-panel';

const MOCK_POSTS: ContentItem[] = [
  {
    id: 1,
    title: '제주 여행 기념품 추천',
    author: '김지수',
    createdAt: '2025.08.25',
    status: 'VISIBLE',
    content: '제주 여행에서 구입한 소품들을 소개합니다.',
  },
  {
    id: 2,
    title: '핸드메이드 가죽 지갑 리뷰',
    author: '이도윤',
    createdAt: '2025.08.22',
    status: 'VISIBLE',
    content: '달빛공방에서 구입한 가죽 지갑 리뷰입니다.',
  },
  {
    id: 3,
    title: '부적절한 게시글',
    author: '홍길동',
    createdAt: '2025.08.20',
    status: 'BLIND',
    content: '블라인드 처리된 게시글입니다.',
  },
];

export const AdminPosts = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_POSTS);

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
      title="포스트 관리"
      items={items}
      onDelete={handleDelete}
      onBlind={handleBlind}
      onUnblind={handleUnblind}
    />
  );
};
