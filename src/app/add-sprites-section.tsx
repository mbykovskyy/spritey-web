"use client";

import { useState, useEffect, useCallback  } from 'react'

export default function AddSpritesSection({sprites, onChange}: {sprites: any, onChange: any}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editSprite, setEditSprite] = useState<any>(null);
  const [showProgressbar, setShowProgressbar] = useState(false);
  const [progressPercentile, setProgressPercentile] = useState(0);
  const [pageStartIndex, setPageStartIndex] = useState(0);
  const [pageEndIndex, setPageEndIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalSpritesCount, setTotalSpritesCount] = useState(0);
  const serverSideRender = true;

  const changeSpriteName = async (sprite: any, newName: string) => {
    if (serverSideRender) {
      const formData = new FormData();
      formData.set('name', newName);

      const sheetId = localStorage.getItem('sheetId');
      const response = await fetch(`http://localhost:8080/${sheetId}/sprites/${sprite.id}`, {
        method: 'PATCH',
        body: formData
      });
 
      if (response.status === 204) {
        const paginatedSprites = await fetchSprites(pageNumber, searchTerm);
        updateSpritesTable(paginatedSprites);
        setEditSprite(null);
      }
    }
  };
  
  const removeSprite = async (sprite: any) => {
    if (serverSideRender) {
      const sheetId = localStorage.getItem('sheetId');
      const response = await fetch(`http://localhost:8080/${sheetId}/sprites/${sprite.id}`, {
        method: 'DELETE'
      });
 
      if (response.status == 204) {
        const paginatedSprites = await fetchSprites(pageNumber, searchTerm);
        updateSpritesTable(paginatedSprites);
      }
    } else  {
      onChange(sprites.filter((s: any) => s.name !== sprite.name));
    }
  };

  const addFiles = async (fileList: FileList | null) => {
    if (fileList) {
      if (serverSideRender) {
        await uploadFiles(fileList);
        const paginatedSpriteList = await fetchSprites(pageNumber, searchTerm)
        updateSpritesTable(paginatedSpriteList);
      } else {
        loadFiles(fileList);
      }
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    const sliceSize = 10;
    const fileArray = Array.from(fileList);
    const percentileIncrement = 100 / Math.ceil(fileArray.length / sliceSize);

    setProgressPercentile(0);
    setShowProgressbar(true);

    for (let i = 0; i < fileArray.length; i += sliceSize) {
      const uploadedSprites = await uploadFilesBatch(fileArray.slice(i, i + sliceSize));
      // onChange((existingSprites: any[]) => existingSprites.concat(uploadedSprites));
      setProgressPercentile(oldProgressPercentile => oldProgressPercentile + percentileIncrement);
    }

    setShowProgressbar(false);
  }

  const uploadFilesBatch = async (files: File[]) => {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    const sheetId = localStorage.getItem('sheetId');
    const response = await fetch(`http://localhost:8080/${sheetId}/sprites`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }

  const loadFiles = async (fileList: FileList) => {
    const newSprites = await Promise.all(
      Array.from(fileList).map(async (file: File) => loadImageFile(file))
    );
    onChange([...sprites, ...newSprites]);
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

  const nextPage = () => {
    if (pageEndIndex < totalSpritesCount) {
      const nextPageNumber = pageNumber + 1;
      fetchSprites(nextPageNumber, searchTerm).then(updateSpritesTable);
      setPageNumber(nextPageNumber);
    }
  };

  const previousPage = () => {
    if (pageStartIndex > 1) {
      const previousPageNumber = pageNumber - 1;
      fetchSprites(previousPageNumber, searchTerm).then(updateSpritesTable);
      setPageNumber(previousPageNumber);
    }
  };

  const fetchSprites = useCallback(async (page: number, search: string = '') => {
    const sheetId = localStorage.getItem('sheetId');
    const queryParams = new URLSearchParams({
      page: `${page}`,
      limit: '10',
      search: search
    });
    const response = await fetch(`http://localhost:8080/${sheetId}/sprites?${queryParams}`, {
      method: 'GET'
    });
    return response.json();
  }, []);

  const updateSpritesTable = useCallback((paginatedSpriteList: any) => {
    setPageStartIndex(paginatedSpriteList.startIndex + 1);
    setPageEndIndex(paginatedSpriteList.startIndex + paginatedSpriteList.sprites.length);
    setTotalSpritesCount(paginatedSpriteList.totalCount);
    onChange(paginatedSpriteList.sprites);
  }, []);

  useEffect(() => {
    fetchSprites(1).then(updateSpritesTable);
  }, [fetchSprites, updateSpritesTable]);

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
                addFiles(e.target.files);

              }}
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
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  const searchTerm = e.target.value;
                  setSearchTerm(searchTerm);
                  fetchSprites(1, searchTerm).then(updateSpritesTable);
                }}
              />
            </div>
          </div>
        </div>
        {
          showProgressbar &&
          <div>
            <div className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: progressPercentile + "%"}}></div>
            </div>
          </div>
        }
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
        {
          sprites.length > 0 &&
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">{pageStartIndex}-{pageEndIndex}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalSpritesCount}</span></span>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                  {
                    pageStartIndex > 1 &&
                      <a onClick={previousPage} className="cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                    ||
                      <span className="cursor-default flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">Previous</span>
                  }
                </li>
                <li>
                  {
                    pageEndIndex < totalSpritesCount &&
                      <a onClick={nextPage} className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                    ||
                      <span className="cursor-default flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">Next</span>
                  }
                </li>
              </ul>
            </nav>
        }
      </div>
    </div>
  ) 
}
