'use client';
import AdminLayout from '@/shared/layouts/adminLayout';
import React from 'react';
import { ArrowUpDown, CheckCircle2, SearchIcon, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Modal from '@/shared/modal/Modal';
import { Role } from '@/app/register/types';
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from '@/components/ui/pagination';
import { useUserList } from '@/services/auth/useUserList';

const Organisations = () => {
  const {
    users: organisations,
    page,
    setPage,
    totalPageNumber,
    isDialogOpen,
    setDialogOpen,
    userIdToDelete: organisationIdToDelete,
    setUserIdToDelete: setOrganisationIdToDelete,
    sortUsers: sortOrganisations,
    searchText,
    deleteUser: deleteOrganisation,
  } = useUserList({
    initialRole: Role.ORGANISATION,
  });

  return (
    <AdminLayout
      headerChildren={<AdminOrganisationHeader searchText={searchText} />}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">
            Organisation List
          </h1>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[80px] cursor-pointer"
                  onClick={() => sortOrganisations('id')}>
                  <div className="flex justify-between">
                    ID
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer grid-cols-1 align-middle md:table-cell"
                  onClick={() => sortOrganisations('email')}>
                  <div className="flex justify-between">
                    Email
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() =>
                    sortOrganisations('organisationAttributes.name')
                  }>
                  <div className="flex justify-between">
                    Name
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() =>
                    sortOrganisations('organisationAttributes.city')
                  }>
                  <div className="flex justify-between">
                    City
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Oib</TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() => sortOrganisations('active')}>
                  <div className="flex justify-between">
                    Status
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organisations.map((organisation) => (
                <TableRow key={organisation.id}>
                  <TableCell>{organisation.id}</TableCell>
                  <TableCell className="md:table-cell">
                    {organisation.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {organisation.organisationAttributes.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {organisation.organisationAttributes.city}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {organisation.organisationAttributes.oib}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {organisation.active ? <CheckCircle2 /> : <XCircle />}
                  </TableCell>
                  <TableCell>
                    <Button className="ml-2" size="sm" variant="outline">
                      <Link href={`organisations/profile/${organisation.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      className="ml-2"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOrganisationIdToDelete(organisation.id);
                        setDialogOpen(true);
                      }}>
                      Delete
                    </Button>
                    {isDialogOpen && (
                      <Modal
                        isOpen={isDialogOpen}
                        onClose={() => setDialogOpen(false)}>
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Delete User
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete organisation ID:{' '}
                              {organisationIdToDelete}.
                            </p>
                          </div>
                        </div>
                        <div className="justify-center px-4 py-3 sm:flex sm:px-6">
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() =>
                              deleteOrganisation(organisationIdToDelete!)
                            }>
                            Yes
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setDialogOpen(false)}>
                            Close
                          </button>
                        </div>
                      </Modal>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationPages
              totalPageNumber={totalPageNumber}
              currentPage={page + 1}
              onChangePage={(pageNumber) => setPage(pageNumber)}
              onPreviousPage={() => {
                if (page === 0) return;
                setPage(page - 1);
              }}
              onNextPage={() => {
                if (page === totalPageNumber - 1) return;
                setPage(page + 1);
              }}
            />
          </PaginationContent>
        </Pagination>
      </main>
    </AdminLayout>
  );
};

type AdminOrganisationHeaderProps = {
  searchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AdminOrganisationHeader: React.FC<AdminOrganisationHeaderProps> = ({
  searchText,
}) => {
  return (
    <div className="w-full">
      <form>
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="w-full appearance-none bg-white pl-8 shadow-none md:w-2/3 lg:w-1/3"
            placeholder="Search organisations by name..."
            type="search"
            onChange={searchText}
          />
        </div>
      </form>
    </div>
  );
};

export default Organisations;
