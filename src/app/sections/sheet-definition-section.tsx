"use client";

import { Sheet } from '../types/types';
import { updateSheet } from '../api/spritey-server-api';
import SectionNumber from '../components/atoms/section/section-number';
import SectionHeader from '../components/atoms/section/section-header';
import Section from '../components/atoms/section/section';
import { Input } from '../components/atoms/input';
import Label from '../components/atoms/label';
import Checkbox from '../components/atoms/checkbox'
import { InputGroup, Text } from '../components/atoms/input-group';
import InputField from '../components/atoms/input-field';

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
            <InputField
              label="Maximum width"
              type="number"
              required
              value={sheet.maxWidth}
              onChange={(e) => onChange({...sheet, maxWidth: parseInt(e.target.value)})}
              onBlur={(e) => updateSheetProp('maxWidth', parseInt(e.target.value))}
            />
            <InputField
                label="Maximum height"
                type="number"
                required
                value={sheet.maxHeight}
                onChange={(e) => onChange({...sheet, maxHeight: e.target.value})}
                onBlur={(e) => updateSheetProp('maxHeight', parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center mb-4">
            <Checkbox
              id="power-of-two-checkbox"
              type="checkbox"
              checked={sheet.isPowerOfTwo}
              onChange={(e) => updateSheetProp('isPowerOfTwo', e.target.checked)}
            />
            <Label htmlFor="power-of-two-checkbox">Make sheet dimentions power of two</Label>
          </div>
          <div className="flex items-center mb-4">
            <Checkbox
              id="maintain-aspect-ratio-checkbox"
              type="checkbox"
              checked={sheet.isMaintainAspectRatio}
              onChange={(e) => updateSheetProp('isMaintainAspectRatio', e.target.checked)}
            />
            <Label htmlFor="maintain-aspect-ratio-checkbox">Maintain dimentions aspect ratio</Label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="background-color-input">Background color</Label>
              <InputGroup>
                <Text>#</Text>
                <Input
                  id="background-color-input"
                  type="text"
                  defaultValue={sheet.backgroundColor}
                  onBlur={(e) => updateSheetProp('backgroundColor', e.target.value)}
                />
              </InputGroup>
            </div>
          </div>
        </form>
      </Section>
    </div>
  ) 
}
