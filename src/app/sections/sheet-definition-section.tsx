"use client";

import { Sheet } from '../types/types';
import { updateSheet } from '../api/spritey-server-api';
import SectionNumber from '../components/atoms/section/section-number';
import SectionHeader from '../components/atoms/section/section-header';
import Section from '../components/atoms/section/section';
import Input from '../components/atoms/input';
import Label from '../components/atoms/label';

export default function SheetDefinitionSection({sheet, onChange}: {sheet: Sheet, onChange: any}) {
  async function updateSheetProp(propName: keyof Sheet, newValue: any) {
      const newSheet = await updateSheet(sheet.id, propName, newValue.toString());
      onChange({...sheet, ...newSheet});
  }

  return (
    <div className="flex">
      <SectionNumber>1.</SectionNumber>
      <Section>
        <SectionHeader>Sprite sheet dimentions and color</SectionHeader>
        <form>
          <div className="grid gap-6 mb-4 md:grid-cols-2">
            <div>
              <Label htmlFor="max-width-input">Maximum width</Label>
              <Input
                id="max-width-input"
                type="number"
                required
                value={sheet.maxWidth}
                onChange={(e) => onChange({...sheet, maxWidth: parseInt(e.target.value)})}
                onBlur={(e) => updateSheetProp('maxWidth', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="max-height-input">Maximum height</Label>
              <Input
                id="max-height-input"
                type="number"
                required
                value={sheet.maxHeight}
                onChange={(e) => onChange({...sheet, maxHeight: e.target.value})}
                onBlur={(e) => updateSheetProp('maxHeight', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="power-of-two-checkbox"
              type="checkbox"
              checked={sheet.isPowerOfTwo}
              onChange={(e) => updateSheetProp('isPowerOfTwo', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="power-of-two-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Make sheet dimentions power of two
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="maintain-aspek-ratio-checkbox"
              type="checkbox"
              checked={sheet.isMaintainAspectRatio}
              onChange={(e) => updateSheetProp('isMaintainAspectRatio', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="maintain-aspek-ratio-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Maintain dimentions aspect ratio
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="background-color-input">Background color</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xl text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  #
                </span>
                <input
                  id="background-color-input"
                  type="text"
                  className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  defaultValue={sheet.backgroundColor}
                  onBlur={(e) => updateSheetProp('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </Section>
    </div>
  ) 
}
