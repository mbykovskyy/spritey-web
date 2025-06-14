"use client";

export default function ProgressBar({visible, progress}: {visible: boolean, progress: number}) {
  return (
    visible &&
    <div>
      <div className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Uploading...</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: progress + "%"}}></div>
      </div>
    </div>
  )
}
