"use client";

import { useRef, useState } from 'react'
import pack from './packer/packer';
import { Sheet } from './types';

import { create } from 'xmlbuilder2';
import ImageTypeList from './image-type-list';
import MetadataTypeList from './metadata-type-list';
import { compileSheet } from './spritey-server-api';

export default function GenerateSpriteSheetSection({sheetId}: {sheetId: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageType, setImageType] = useState('png');
  const [metadataType, setMetadataType] = useState('json');
  const [metadata, setMetadata] = useState('');
  const [imageDataUri, setImageDataUri] = useState('');
  const [metadataDataUri, setMetadataDataUri] = useState('');
  const [generateError, setGenerateError] = useState('');

  function generateMetadata(sheetSize: any, sheetBackground: any, sprites: any[]) {
    return {
      sheet: {
        width: sheetSize.width,
        height: sheetSize.height,
        background: sheetBackground
      },
      sprites: sprites.map((s) => {
        return {
          name: s.name,
          x: s.x,
          y: s.y,
          width: s.width,
          height: s.height
        }
      })
    };
  }

  function generateMetadataJson(metadata: any) {
    return JSON.stringify(metadata, null, 2);
  }

  function generateMetadataXml(metadata: any) {
    const builder = create({ version: '1.0' })
      .ele('sheet', {
        width: metadata.sheet.width,
        height: metadata.sheet.height,
        background: metadata.sheet.background
      });

      for (const sprite of metadata.sprites) {
        builder.ele('sprite', {
          name: sprite.name,
          x: sprite.x,
          y: sprite.y,
          width: sprite.width,
          height: sprite.height
        }).up();
      }

      return builder.up().end({ prettyPrint: true });
  }

  async function generate() {
    const status = await compileSheet(sheetId, { imageType: imageType, metadataType: metadataType });

    if (status !== 204) {
      setGenerateError("Error occured compiling a sprite sheet.");
    }

    // try {
    //   setGenerateError('');
    //   setImageDataUri('');
    //   setMetadataDataUri('');

    //   const sheetSize = pack(sprites, sheet);
    //   const canvas = canvasRef.current;

    //   if (canvas) {
    //     canvas.width = sheetSize.width;
    //     canvas.height = sheetSize.height;

    //     const ctx = canvas.getContext('2d');
    //     if (ctx) {
    //       ctx.fillStyle = '#' + sheet.backgroundColor;
    //       ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //       for (const sprite of sprites) {
    //         ctx.drawImage(sprite.data, sprite.x, sprite.y);
    //       }

    //       setImageDataUri(canvas.toDataURL('image/' + imageType));
    //     }
    //   }

    //   const metadata = generateMetadata(sheetSize, sheet.backgroundColor, sprites);
    //   const metadataStr = (metadataType === 'json')
    //     ? generateMetadataJson(metadata)
    //     : generateMetadataXml(metadata);

    //   const mimeType = (metadataType === 'json')
    //     ? 'application/json'
    //     : 'text/xml';

    //   setMetadata(metadataStr);
    //   setMetadataDataUri('data:' + mimeType + ';base64,' + btoa(metadataStr));
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setGenerateError(error.message);
    //   }
    // }
  }

  return (
    <div className="flex">
      <span className="text-6xl mt-3 me-4 text-gray-900 dark:text-gray-300">3.</span>
      <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h4 className="flex mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
          Generate sprite sheet
        </h4>
        <div className="mb-4">
          <div className="mb-4">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Image type
            </span>
            <ImageTypeList value={imageType} onChange={setImageType}/>
          </div>
          <div>
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Metadata type
            </span>
            <MetadataTypeList value={metadataType} onChange={setMetadataType}/>
          </div>
        </div>
        <div className="text-center">
          <button onClick={generate} type="button" className="px-6 py-3.5 items-center inline-flex text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 me-2">
              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
            </svg>
            Generate Sprite Sheet
          </button>
        </div>
        {
          generateError !== '' && <div id="toast-undo" className="mt-4 flex items-center w-full max-w p-4 text-gray-500 bg-white rounded-lg shadow dark:text-red-800 dark:bg-red-400" role="alert">
            <div className="text-sm font-normal">{generateError}</div>
            <div className="flex items-center ms-auto space-x-2 rtl:space-x-reverse">
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-red-800 dark:hover:text-white dark:bg-red-400 dark:hover:bg-red-500"
                data-dismiss-target="#toast-undo"
                aria-label="Close"
                onClick={(_) => setGenerateError('')}
              >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
          </div>
        }
        <canvas hidden ref={canvasRef} />
        {
          imageDataUri !== '' && <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <a
                href={imageDataUri}
                download
                className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Download image
              </a>
              <img className="mt-2 max-h-96" id="sprite-sheet" src={imageDataUri} />
            </div>
            <div className="flex flex-col">
              <a
                href={metadataDataUri}
                download
                className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Download metadata
              </a>
              <textarea readOnly id="metadata" value={metadata} rows={4} className="mt-2 block flex-1 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
            </div>
          </div>
        }
      </div>
    </div>
  ) 
}
