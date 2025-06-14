export interface Sheet {
  id: string;
  maxWidth: number;
  maxHeight: number;
  isPowerOfTwo: boolean;
  isMaintainAspectRatio: boolean;
  backgroundColor: string;
};

export interface Sprite {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface PaginatedSpriteList {
  sprites: Sprite[];
  totalCount: number;
  startIndex: number;
};
