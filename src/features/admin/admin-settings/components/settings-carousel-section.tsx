import { useRef, useState, type ChangeEvent } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { GripVertical, X, Plus } from 'lucide-react';

import { SettingsSection } from './settings-section';

interface CarouselImage {
  id: string;
  url: string;
  file?: File;
}

const MAX_IMAGES = 5;

const MOCK_CAROUSEL: CarouselImage[] = [];

export const SettingsCarouselSection = () => {
  const [images, setImages] = useState<CarouselImage[]>(MOCK_CAROUSEL);
  const [isEditing, setIsEditing] = useState(false);
  const [editImages, setEditImages] = useState<CarouselImage[]>(images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasValue = images.length > 0;

  const handleEdit = () => {
    setEditImages([...images]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditImages([...images]);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API 연결 - 이미지 업로드 및 순서 저장
    setImages([...editImages]);
    setIsEditing(false);
    alert('저장되었습니다.');
  };

  const handleDelete = () => {
    if (!confirm('캐러셀 이미지를 모두 삭제하시겠습니까?')) return;
    // TODO: API 연결
    setImages([]);
    setEditImages([]);
    setIsEditing(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - editImages.length;
    const sliced = files.slice(0, remaining);

    const newImages: CarouselImage[] = sliced.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setEditImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setEditImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...editImages];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setEditImages(reordered);
  };

  const displayImages = isEditing ? editImages : images;

  return (
    <SettingsSection
      title="캐러셀 이미지"
      isEditing={isEditing}
      hasValue={hasValue}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    >
      {displayImages.length === 0 && !isEditing ? (
        <p className="py-4 text-center text-sm text-gray-400">
          등록된 이미지가 없습니다.
        </p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="carousel"
            direction="horizontal"
            isDropDisabled={!isEditing}
          >
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-2 overflow-x-auto"
                role="list"
              >
                {displayImages.map((img, index) => (
                  <Draggable
                    key={img.id}
                    draggableId={img.id}
                    index={index}
                    isDragDisabled={!isEditing}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 ${
                          snapshot.isDragging ? 'shadow-md' : ''
                        }`}
                      >
                        {/* 드래그 핸들 */}
                        {isEditing && (
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                            aria-label="순서 변경"
                          >
                            <GripVertical size={16} />
                          </div>
                        )}

                        {/* 순서 번호 */}
                        <span className="w-5 shrink-0 text-center text-xs text-gray-400">
                          {index + 1}
                        </span>

                        {/* 썸네일 */}
                        <div className="h-12 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                          <img
                            src={img.url}
                            alt={`캐러셀 ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* 파일명 */}
                        <span className="flex-1 truncate text-xs text-gray-600">
                          {img.file?.name ??
                            img.url.split('/').pop() ??
                            '이미지'}
                        </span>

                        {/* 개별 삭제 */}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="shrink-0 text-gray-300 hover:text-red-400"
                            aria-label="이미지 삭제"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* 이미지 추가 버튼 */}
      {isEditing && editImages.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-3 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600"
        >
          <Plus size={14} aria-hidden="true" />
          이미지 추가 ({editImages.length}/{MAX_IMAGES})
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </SettingsSection>
  );
};
