"use client";

type TablePaginationProps = {
  visible: boolean;
  page: number;
  pageStartIndex: number;
  pageEndIndex: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
};

export default function TablePagination({visible, page, pageStartIndex, pageEndIndex, totalCount, onPageChange}: TablePaginationProps) {
  return (
    visible &&
    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">{pageStartIndex}-{pageEndIndex}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span></span>
      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          {
            pageStartIndex > 1 &&
              <a onClick={() => onPageChange(page - 1)} className="cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
            ||
              <span className="cursor-default flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">Previous</span>
          }
        </li>
        <li>
          {
            pageEndIndex < totalCount &&
              <a onClick={() => onPageChange(page + 1)} className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
            ||
              <span className="cursor-default flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">Next</span>
          }
        </li>
      </ul>
    </nav>
  )
}
