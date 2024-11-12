"use client";

import { useState, useEffect, useCallback  } from 'react'
import { deleteSprite, getSprites, updateSpriteName, uploadSprites } from './spritey-server-api';
import SearchBox from './search-box';
import ProgressBar from './progress-bar';
import TablePagination from './table-pagination';
import { PaginatedSpriteList, Sprite } from './types';

export default function AddSpritesSection({sheetId}: {sheetId: string}) {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [editSprite, setEditSprite] = useState<any>(null);
  const [showProgressbar, setShowProgressbar] = useState(false);
  const [progressPercentile, setProgressPercentile] = useState(0);
  const [pageStartIndex, setPageStartIndex] = useState(0);
  const [pageEndIndex, setPageEndIndex] = useState(0);
  const [totalSpritesCount, setTotalSpritesCount] = useState(0);

  const changeSpriteName = async (sprite: Sprite, newName: string) => {
    const status = await updateSpriteName(sheetId, sprite.id, newName);

    if (status === 204) {
      const paginatedSprites = await getSprites(sheetId, pageNumber, searchTerm);
      updateSpritesTable(paginatedSprites);
      setEditSprite(null);
    }
  };
  
  const removeSprite = async (sprite: Sprite) => {
    const status = await deleteSprite(sheetId, sprite.id);

    if (status === 204) {
      const paginatedSprites = await getSprites(sheetId, pageNumber, searchTerm);
      updateSpritesTable(paginatedSprites);
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    const sliceSize = 10;
    const fileArray = Array.from(fileList);
    const percentileIncrement = 100 / Math.ceil(fileArray.length / sliceSize);

    setProgressPercentile(0);
    setShowProgressbar(true);

    for (let i = 0; i < fileArray.length; i += sliceSize) {
      await uploadSprites(sheetId, fileArray.slice(i, i + sliceSize));
      setProgressPercentile(oldProgressPercentile => oldProgressPercentile + percentileIncrement);
    }

    setShowProgressbar(false);

    const paginatedSpriteList = await getSprites(sheetId, pageNumber, searchTerm)
    updateSpritesTable(paginatedSpriteList);
  }

  const updateSpritesTable = useCallback((paginatedSpriteList: PaginatedSpriteList) => {
    setPageStartIndex(paginatedSpriteList.startIndex + 1);
    setPageEndIndex(paginatedSpriteList.startIndex + paginatedSpriteList.sprites.length);
    setTotalSpritesCount(paginatedSpriteList.totalCount);
    setSprites(paginatedSpriteList.sprites);
  }, []);

  useEffect(() => {
    if (sheetId !== '') {
      getSprites(sheetId, pageNumber, searchTerm).then(updateSpritesTable);
    }
  }, [sheetId, pageNumber, searchTerm, updateSpritesTable]);

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
              onChange={(e) => {
                if (e.target.files) {
                  uploadFiles(e.target.files);
                }
              }}
            />
          </div>
          <SearchBox
            onChange={(searchTerm) => {
              setSearchTerm(searchTerm);
              setPageNumber(1);
            }}
          />
        </div>
        <ProgressBar visible={showProgressbar} progress={progressPercentile} />
        <div className="relative overflow-x-auto sm:rounded-t-lg">
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
                (sprites.length === 0) && searchTerm === '' &&
                <tr>
                  <th colSpan={3} scope="row" className=" text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    No sprites have been uploaded yet.
                  </th>
                </tr> ||
                (sprites.length === 0) && searchTerm !== '' &&
                <tr>
                  <th colSpan={3} scope="row" className=" text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    No sprites match search criteria.
                  </th>
                </tr> ||
                sprites
                  .map((sprite: any, i: number) => {
                    const spriteNameCell = (editSprite === null || editSprite.id !== sprite.id) &&
                      <th scope="row" className="w-6/12 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {sprite.name}
                      </th>;
                    const editSpriteNameCell = (editSprite !== null && editSprite.id === sprite.id) &&
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
                            onBlur={(e) => changeSpriteName(editSprite, e.target.value)}
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
                        <a onClick={() => removeSprite(sprite)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline ms-3">
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
        <TablePagination
          visible={sprites.length > 0}
          pageStartIndex={pageStartIndex}
          pageEndIndex={pageEndIndex}
          totalCount={totalSpritesCount}
          page={pageNumber}
          onPageChange={setPageNumber}
        />
      </div>
    </div>
  ) 
}
