import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationControls({ page, totalPages, setPage }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
        </PaginationItem>

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              onClick={() => setPage(i + 1)}
              isActive={page === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
