"use client";

import { Container } from '@mui/material'
import styles from './page.module.css'
import SheetDefinitionSection from './sheet-definition-section';
import AddSpritesSection from './add-sprites-section';
import GenerateSpriteSheetSection from './generate-sprite-sheet-section';
import { Sheet } from './types';
import { createSheet, getSheet } from './spritey-server-api';

import { useEffect, useState } from 'react';

export default function Home() {
  const [sheet, setSheet] = useState<Sheet>({
    id: '',
    maxWidth: 0,
    maxHeight: 0,
    isPowerOfTwo: false,
    isMaintainAspectRatio: false,
    backgroundColor: '000000'
  });

  useEffect(() => {
    const sheetId = localStorage.getItem('sheetId');

    if (sheetId === null) {
      createSheet().then((sheetDef) => {
        localStorage.setItem('sheetId', sheetDef.id);
        setSheet(sheetDef);
      });
    } else {
      getSheet(sheetId).then(setSheet);
    }
  }, []);

  return (
    <Container maxWidth="md" className={styles.container}>
      <div className="flex items-center justify-center">
        <div className="text-9xl pb-10 inline-block text-transparent bg-clip-text font-medium bg-gradient-to-br from-green-400 to-blue-600 ">Spritey</div>
      </div>
      <SheetDefinitionSection sheet={sheet} onChange={(s: any) => setSheet(s)} />
      <AddSpritesSection sheetId={sheet.id} />
      <GenerateSpriteSheetSection sheetId={sheet.id} />
    </Container>
  ) 
}
