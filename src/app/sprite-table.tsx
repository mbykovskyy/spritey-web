"use client";

import { useState } from "react";
import { Sprite } from "./types";

type SpriteTableProps = {
  sprites: Sprite[];
  noSpritesText: string;
  onSpriteRemove: (sprite: Sprite) => void;
  onSpriteNameChange: (sprite: Sprite, newName: string) => Promise<void>;
};

export default function SpriteTable({sprites, noSpritesText, onSpriteRemove, onSpriteNameChange}: SpriteTableProps) {
  const [editSprite, setEditSprite] = useState<Sprite | null>(null);

  return (
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
            (sprites.length === 0) &&
            <tr>
              <th colSpan={3} scope="row" className=" text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {noSpritesText}
              </th>
            </tr> ||
            sprites
              .map((sprite: Sprite, i: number) => {
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
                        onBlur={(e) => {
                          onSpriteNameChange(editSprite, e.target.value)
                            .then(() => setEditSprite(null));
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
                    <a onClick={() => onSpriteRemove(sprite)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline ms-3">
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
  )
}
