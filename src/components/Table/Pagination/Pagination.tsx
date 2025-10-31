import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import * as Theme from "@radix-ui/themes"
import { useEffect } from "react";

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        const scrollContainer = document.querySelector(
            '[data-radix-scroll-area-viewport]'
        ) as HTMLElement | null;

        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    if (!totalPages || totalPages <= 1) return null;

    const handlePageChange = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages));
        onPageChange(newPage);
    };

    return (
        <nav
            aria-label="Paginação"
            className="flex items-center justify-center gap-2 mt-4"
        >
            <Theme.Button
                variant="surface"
                className="hover:cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <ArrowLeftIcon />
            </Theme.Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Theme.Button
                    key={page}
                    variant={currentPage === page ? "solid" : "soft"}
                    onClick={() => handlePageChange(page)}
                    className="w-10 hover:cursor-pointer"
                >
                    {page}
                </Theme.Button>
            ))}

            <Theme.Button
                variant="surface"
                className="hover:cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <ArrowRightIcon />
            </Theme.Button>
        </nav>
    );
};

export default Pagination;
