import { Sheet } from './types';

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

export async function updateSheet(sheetId: string, prop: string, value: string) {
    const formData = new FormData();
    formData.set(prop, value);

    const response = await fetch(`${spriteyServerUri}/sheet/${sheetId}`, {
      method: 'PATCH',
      body: formData
    });

    return response.json();
}