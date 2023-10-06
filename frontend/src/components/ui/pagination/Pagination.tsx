import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
    minPage: number;
    maxPage: number;
    currentPage: number;
    setPage: (page: number) => any;
}

export default function Pagination({ minPage = 1, maxPage, currentPage, setPage }: PaginationProps): React.ReactElement {
    return (
        <div className="pagination">
            <button onClick={() => setPage(minPage)} disabled={currentPage <= minPage}>
                <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button onClick={() => setPage(Math.max(minPage, currentPage - 1))} disabled={currentPage <= minPage}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>

            {currentPage + 1 > maxPage && currentPage > minPage + 3 &&
                <button onClick={() => setPage(currentPage - 4)}>
                    {currentPage - 4}
                </button>
            }

            {currentPage + 2 > maxPage && currentPage > minPage + 2 &&
                <button onClick={() => setPage(currentPage - 3)}>
                    {currentPage - 3}
                </button>
            }

            {currentPage - 2 >= minPage &&
                <button onClick={() => setPage(currentPage - 2)}>
                    {currentPage - 2}
                </button>
            }

            {currentPage - 1 >= minPage &&
                <button onClick={() => setPage(currentPage - 1)}>
                    {currentPage - 1}
                </button>
            }

            <button className="pagination-button-current-page" disabled={true}>
                {currentPage}
            </button>

            {currentPage + 1 <= maxPage &&
                <button onClick={() => setPage(currentPage + 1)}>
                    {currentPage + 1}
                </button>
            }

            {currentPage + 2 <= maxPage &&
                <button onClick={() => setPage(currentPage + 2)}>
                    {currentPage + 2}
                </button>
            }

            {currentPage - 2 < minPage && currentPage < maxPage - 2 &&
                <button onClick={() => setPage(currentPage + 3)}>
                    {currentPage + 3}
                </button>
            }

            {currentPage - 1 < minPage && currentPage < maxPage - 3 &&
                <button onClick={() => setPage(currentPage + 4)}>
                    {currentPage + 4}
                </button>
            }

            <button onClick={() => setPage(Math.min(maxPage, currentPage + 1))} disabled={currentPage >= maxPage}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button onClick={() => setPage(maxPage)} disabled={currentPage >= maxPage}>
                <FontAwesomeIcon icon={faAnglesRight} />
            </button>
        </div>
    );
}
