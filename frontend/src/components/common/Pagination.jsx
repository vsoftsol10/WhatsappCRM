import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startItem =
    (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm md:flex-row">
      <p className="text-center text-sm text-gray-600 md:text-left">
        Showing{" "}
        <span className="font-semibold">
          {startItem}
        </span>{" "}
        -{" "}
        <span className="font-semibold">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalItems}
        </span>{" "}
        entries
      </p>

      <div className="flex max-w-full flex-wrap items-center justify-center gap-2">

        <button
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft />
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-1 text-gray-500 sm:px-2"
            >
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() =>
                onPageChange(page)
              }
              className={`h-10 w-10 rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-[#25D366] text-black"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight />
        </button>

      </div>
    </div>
  );
}

export default Pagination;
