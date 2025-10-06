import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

type PaginationProps = {
  totalPageNumber: number;
  currentPage: number;
  onChangePage(page: number): void;
  onPreviousPage(): void;
  onNextPage(): void;
};

const PaginationPages: React.FC<PaginationProps> = ({
  totalPageNumber,
  currentPage,
  onChangePage,
  onPreviousPage,
  onNextPage,
}) => {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPageNumber <= 10) {
      for (let i = 1; i <= totalPageNumber; i++) {
        pages.push(
          <PaginationItem key={i} onClick={() => onChangePage(i)}>
            <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1} onClick={() => onChangePage(1)}>
          <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );

      // Determine if we need ellipsis and which pages to show
      let startPage: number;
      let endPage: number;

      if (currentPage <= 4) {
        // Near the beginning: show 1, 2, 3, 4, 5, ..., last
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPageNumber - 3) {
        // Near the end: show 1, ..., last-4, last-3, last-2, last-1, last
        startPage = totalPageNumber - 4;
        endPage = totalPageNumber - 1;
      } else {
        // In the middle: show 1, ..., current-1, current, current+1, ..., last
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Show ellipsis at start if needed
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show the calculated range of pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPageNumber) {
          pages.push(
            <PaginationItem key={i} onClick={() => onChangePage(i)}>
              <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis at end if needed
      if (endPage < totalPageNumber - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page (if it's not the first page)
      if (totalPageNumber > 1) {
        pages.push(
          <PaginationItem
            key={totalPageNumber}
            onClick={() => onChangePage(totalPageNumber)}>
            <PaginationLink isActive={currentPage === totalPageNumber}>
              {totalPageNumber}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <>
      <PaginationItem onClick={() => onPreviousPage()}>
        <PaginationPrevious />
      </PaginationItem>

      {renderPageNumbers()}

      <PaginationItem onClick={() => onNextPage()}>
        <PaginationNext />
      </PaginationItem>
    </>
  );
};
PaginationPages.displayName = 'PaginationPages';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
    style={{ cursor: 'pointer' }}
  />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationPages,
};
