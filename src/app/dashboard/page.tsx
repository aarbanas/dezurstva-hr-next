'use client';
import React from 'react';
import DashboardLayout from '@/shared/layouts/dashboardLayout';
import { translateUserTypes } from '@/utils/translateUserTypes';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from '@/components/ui/pagination';
import { ArrowUpDown, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUserList } from '@/services/auth/useUserList';
import UserProfilePhoto from '@/shared/userProfilePhoto/UserProfilePhoto';

const Dashboard: React.FC = () => {
  const { users, page, setPage, totalPageNumber, sortUsers, searchText } =
    useUserList({
      initialFilterKeys: [
        'userAttributes.firstname',
        'userAttributes.lastname',
        'userAttributes.city',
      ],
    });

  const onRowClick = (id: number) => {
    if (window.innerWidth < 768) {
      window.location.href = `/user-profile/${id}`;
    }
  };

  return (
    <>
      <DashboardLayout>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex flex-col items-center md:flex-row">
            <h1 className="text-lg font-semibold md:text-2xl">Početna</h1>
            <div className="flex w-72 sm:w-80 md:ml-auto">
              <form className="ml-3 w-full">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="w-full appearance-none bg-white pl-8 shadow-none"
                    placeholder="Traži po imenu/prezimenu/gradu"
                    type="search"
                    onChange={searchText}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] grid-cols-1 align-middle md:table-cell">
                    Profilna slika
                  </TableHead>
                  <TableHead className="md:table-cell">Ime i prezime</TableHead>
                  <TableHead
                    className="cursor-pointer md:table-cell"
                    onClick={() => sortUsers('userAttributes.type')}>
                    <div className="flex justify-between">
                      Zanimanje
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden cursor-pointer md:table-cell"
                    onClick={() => sortUsers('userAttributes.city')}>
                    <div className="flex justify-between">
                      Lokacija
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Pogledaj profil
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer md:cursor-auto"
                    onClick={() => onRowClick(user.id)}>
                    <TableCell>
                      <UserProfilePhoto user={user} />
                    </TableCell>
                    <TableCell className="md:table-cell">
                      {user.userAttributes.firstname +
                        ' ' +
                        user.userAttributes.lastname}{' '}
                    </TableCell>
                    <TableCell className="md:table-cell">
                      {translateUserTypes(user.userAttributes.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.userAttributes.city}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Button className="ml-2" size="sm" variant="outline">
                        <Link href={`/user-profile/${user.id}`}>
                          Pregledaj profil
                        </Link>
                      </Button>
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
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
