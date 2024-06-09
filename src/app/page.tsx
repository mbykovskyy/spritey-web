"use client";

import { Container } from '@mui/material'
import styles from './page.module.css'
import SheetDefinitionSection from './sheet-definition-section';
import AddSpritesSection from './add-sprites-section';
import GenerateSpriteSheetSection from './generate-sprite-sheet-section';
import { Sheet } from './types';

import { useState } from 'react';

export default function Home() {
  const [sheet, setSheet] = useState<Sheet>({
    maxWidth: 8192,
    maxHeight: 8192,
    isPowerOfTwo: false,
    isMaintainAspectRatio: false,
    backgroundColor: 'FF00FF'
  });
  const[sprites, setSprites] = useState([]);

  return (
    <Container maxWidth="md" className={styles.container}>
      <div className="flex items-center justify-center">
        <div className="text-9xl pb-10 inline-block text-transparent bg-clip-text font-medium bg-gradient-to-br from-green-400 to-blue-600 ">Spritey</div>
      </div>
      <SheetDefinitionSection sheet={sheet} onChange={(s: any) => setSheet(s)} />
      <AddSpritesSection sprites={sprites} onChange={(s: any) => setSprites(s)} />
      <GenerateSpriteSheetSection sheet={sheet} sprites={sprites} />
    </Container>
  ) 
}
