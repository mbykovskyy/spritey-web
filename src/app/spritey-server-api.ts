import { PaginatedSpriteList, Sheet, Sprite } from './types';

const spriteyServerUri = "http://localhost:8080";

export async function createSheet(): Promise<Sheet> {
  const response = await fetch(`${spriteyServerUri}/sheet`, {
      method: 'POST'
  });
  return response.json();
}

export async function getSheet(sheetId: string): Promise<Sheet> {
  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}`, {
    method: 'GET'
  });
  return response.json();
}

export async function updateSheet(sheetId: string, prop: keyof Sheet, value: string): Promise<Sheet> {
  const formData = new FormData();
  formData.set(prop, value);

  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}`, {
    method: 'PATCH',
    body: formData
  });

  return response.json();
}

export async function  getSprites(sheetId: string, page: number, search: string = '', limit: number = 10): Promise<PaginatedSpriteList> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });
  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}/sprites?${queryParams}`, {
    method: 'GET'
  });

  if (response.status === 200) {
    return response.json();
  }

  return { sprites: [], totalCount: 0, startIndex: 0 };
}

export async function deleteSprite(sheetId: string, spriteId: string): Promise<number> {
  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}/sprites/${spriteId}`, {
    method: 'DELETE'
  });
  return response.status;
}

export async function uploadSprites(sheetId: string, files: File[]): Promise<Sprite[]> {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file, file.name);
  }

  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}/sprites`, {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}

export async function updateSpriteName(sheetId: string, spriteId: string, newName: string): Promise<number> {
  const formData = new FormData();
  formData.set('name', newName);
  
  const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}/sprites/${spriteId}`, {
    method: 'PATCH',
    body: formData
  });

  return response.status;
};
