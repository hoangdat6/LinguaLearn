'use client'

import ReactPaginate from 'react-paginate'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-8">
      <ReactPaginate
        previousLabel={'←'}
        nextLabel={'→'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        forcePage={currentPage - 1}
        containerClassName="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
        pageClassName="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer transition duration-200"
        activeClassName="!bg-green-500 font-bold !text-white"
        previousClassName="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer transition"
        nextClassName="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer transition"
        breakClassName="px-2 py-1 text-gray-600 text-sm sm:text-base"
      />
    </div>
  )
}

export default Pagination
