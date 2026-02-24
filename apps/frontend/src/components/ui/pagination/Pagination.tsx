import type React from "react";
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "tailwind-variants";

interface PaginationProps {
  minPage: number;
  maxPage: number;
  currentPage: number;
  setPage: (page: number) => void;
}

const buttonClassName = cn(
  "text-[0.95em] flex items-center justify-center h-[2.1rem] min-w-[2.1rem] px-0.5",
  "border-1 border-neutral-200 dark:border-neutral-600",
  "[&:not(:disabled)]:cursor-pointer [&:not(:disabled)]:hover:bg-neutral-200 [&:not(:disabled)]:dark:hover:bg-neutral-700",
  "ml-[-1px]",
);

const activeButtonClassName = "z-1 bg-app-green-500 dark:bg-app-green-700 text-white";

export default function Pagination({ minPage, maxPage, currentPage, setPage }: PaginationProps): React.ReactElement {
  return (
    <div className="pagination flex">
      <button
        className={cn(buttonClassName, "ml-0 rounded-l-md")}
        onClick={() => {
          setPage(minPage);
        }}
        disabled={currentPage <= minPage}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      <button
        className={buttonClassName}
        onClick={() => {
          setPage(Math.max(minPage, currentPage - 1));
        }}
        disabled={currentPage <= minPage}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      {currentPage + 1 > maxPage && currentPage > minPage + 3 && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage - 4);
          }}
        >
          {currentPage - 4}
        </button>
      )}

      {currentPage + 2 > maxPage && currentPage > minPage + 2 && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage - 3);
          }}
        >
          {currentPage - 3}
        </button>
      )}

      {currentPage - 2 >= minPage && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage - 2);
          }}
        >
          {currentPage - 2}
        </button>
      )}

      {currentPage - 1 >= minPage && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage - 1);
          }}
        >
          {currentPage - 1}
        </button>
      )}

      <button className={cn(buttonClassName, activeButtonClassName)} disabled>
        {currentPage}
      </button>

      {currentPage + 1 <= maxPage && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage + 1);
          }}
        >
          {currentPage + 1}
        </button>
      )}

      {currentPage + 2 <= maxPage && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage + 2);
          }}
        >
          {currentPage + 2}
        </button>
      )}

      {currentPage - 2 < minPage && currentPage < maxPage - 2 && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage + 3);
          }}
        >
          {currentPage + 3}
        </button>
      )}

      {currentPage - 1 < minPage && currentPage < maxPage - 3 && (
        <button
          className={buttonClassName}
          onClick={() => {
            setPage(currentPage + 4);
          }}
        >
          {currentPage + 4}
        </button>
      )}

      <button
        className={buttonClassName}
        onClick={() => {
          setPage(Math.min(maxPage, currentPage + 1));
        }}
        disabled={currentPage >= maxPage}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      <button
        className={cn(buttonClassName, "rounded-r-md")}
        onClick={() => {
          setPage(maxPage);
        }}
        disabled={currentPage >= maxPage}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
}
