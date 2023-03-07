import {type FunctionComponent} from "react";

interface PaginationProps {
    minPage: number;
    maxPage: number;
    currentPage: number;
    setPage: (page: number) => any;
}

const Pagination: FunctionComponent<PaginationProps> = ({
    minPage = 1,
    maxPage,
    currentPage,
    setPage,
}) => {
    return (
        <div className="pagination">
            <button onClick={() => setPage(minPage)} disabled={currentPage <= minPage}>
                <i className="fa-solid fa-angles-left"/>
            </button>
            <button onClick={() => setPage(Math.max(minPage, currentPage - 1))} disabled={currentPage <= minPage}>
                <i className="fa-solid fa-angle-left"/>
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
                <i className="fa-solid fa-angle-right"/>
            </button>
            <button onClick={() => setPage(maxPage)} disabled={currentPage >= maxPage}>
                <i className="fa-solid fa-angles-right"/>
            </button>
        </div>
    );
};

export default Pagination;
