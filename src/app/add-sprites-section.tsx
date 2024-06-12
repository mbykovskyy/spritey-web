"use client";

import { useState } from 'react'

export default function AddSpritesSection({sprites, onChange}: {sprites: any, onChange: any}) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredSprites = sprites.filter((sprite: any) => sprite.name.startsWith(searchTerm));
  const [editSprite, setEditSprite] = useState<any>(null);

  const changeSpriteName = (sprite: any, newName: string) => {
    sprite.name = newName;
  };
  
  const removeSprite = (name: string) => {
    onChange(sprites.filter((sprite: any) => sprite.name !== name));
  };

  const uploadFiles = async (fileList: FileList | null) => {
    if (fileList) {
      const newSprites = await Promise.all(
        Array.from(fileList).map(async (file: File) => loadImageFile(file))
      );
      onChange([...sprites, ...newSprites]);
    }
  };

  const loadImageFile = (file: File) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        resolve({name: file.name, data: image, width: image.width, height: image.height});
      }
    });
  };

  return (
    <div className="flex">
      <span className="text-6xl mt-3 me-4 text-gray-900 dark:text-gray-300">2.</span>
      <div className="w-full mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h4 className="flex mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
          Add sprites
        </h4>
        <div className="grid gap-6 mb-4 md:grid-cols-2">
          <div>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="upload-multiple-files"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </div>
          <div>
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="w-full block py-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for sprite names"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-96 relative sm:rounded-t-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Size</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {
                (sprites.length === 0) &&
                <tr>
                  <th colSpan={3} scope="row" className=" text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    No sprites have been uploaded yet.
                  </th>
                </tr> ||
                (sprites.length > 0) && filteredSprites.length === 0 &&
                <tr>
                  <th colSpan={3} scope="row" className=" text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    No sprites match search criteria.
                  </th>
                </tr> ||
                filteredSprites
                  .map((sprite: any, i: number) => {
                    const spriteNameCell = (editSprite === null || editSprite.name !== sprite.name) &&
                      <th scope="row" className="w-6/12 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {sprite.name}
                      </th>;
                    const editSpriteNameCell = (editSprite !== null && editSprite.name === sprite.name) &&
                      <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="relative">
                          <input
                            autoFocus
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            defaultValue={sprite.name}
                            onKeyDown={(e) => {
                              if(e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            onBlur={(e) => {
                              changeSpriteName(editSprite, e.target.value);
                              setEditSprite(null);
                            }}
                          />
                        </div>
                      </th>;

                  return (
                    <tr key={i} className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      {spriteNameCell || editSpriteNameCell}
                      <td className="px-6 py-4">
                        {sprite.width + 'x' + sprite.height}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a onClick={() => setEditSprite(sprite)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          Edit
                        </a>
                        <a onClick={() => removeSprite(sprite.name)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline ms-3">
                          Remove
                        </a>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) 
}
