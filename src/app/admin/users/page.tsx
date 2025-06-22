'use client';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from '@/components/ui/pagination';
import React from 'react';
import { ArrowUpDown, CheckCircle2, SearchIcon, XCircle } from 'lucide-react';
import AdminLayout from '@/shared/layouts/adminLayout';
import Modal from '@/shared/modal/Modal';
import { useUserList } from '@/services/auth/useUserList';
import { UserDto } from '@/services/user/dto/user.dto';
import { Role, Type } from '@/app/register/types';
import { CertificateTypeEnum } from '@/app/profile/certificates/enums/certificate-types.enum';
import { notifyUser } from '@/app/profile/certificates/services/certificates-service';
import { toast } from 'react-toastify';

const UserList = () => {
  const {
    users,
    page,
    setPage,
    totalPageNumber,
    isDialogOpen,
    setDialogOpen,
    userIdToDelete,
    setUserIdToDelete,
    sortUsers,
    searchText,
    deleteUser,
  } = useUserList({ populateCertificates: true });

  const handleNotifyUser = async (user: UserDto) => {
    const certificateType = (): CertificateTypeEnum => {
      switch (user.userAttributes.type) {
        case Type.DOCTOR:
        case Type.NURSE:
          return CertificateTypeEnum.UNIVERSITY;
        case Type.LIFEGUARD:
          return CertificateTypeEnum.REDCROSS;
      }
    };

    try {
      await notifyUser(user.id, certificateType());
      toast('Email successfully sent to user', { type: 'success' });
    } catch (e) {
      toast('Failed to send email to user', { type: 'error' });
      console.error('Error notifying user:', e);
    }
  };

  return (
    <AdminLayout headerChildren={<AdminUserHeader searchText={searchText} />}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">User List</h1>
        </div>
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[80px] cursor-pointer"
                  onClick={() => sortUsers('id')}>
                  <div className="flex justify-between">
                    ID
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer grid-cols-1 align-middle md:table-cell"
                  onClick={() => sortUsers('email')}>
                  <div className="flex justify-between">
                    Email
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() => sortUsers('userAttributes.firstname')}>
                  <div className="flex justify-between">
                    First Name
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() => sortUsers('userAttributes.lastname')}>
                  <div className="flex justify-between">
                    Last Name
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() => sortUsers('role')}>
                  <div className="flex justify-between">
                    Role
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden cursor-pointer md:table-cell"
                  onClick={() => sortUsers('active')}>
                  <div className="flex justify-between">
                    Status
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead>Certificate uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  style={{
                    backgroundColor:
                      user.role === Role.ADMIN ? 'rgba(255,0,0,0.49)' : 'white',
                  }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.userAttributes.firstname}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.userAttributes.lastname}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.userAttributes.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.active ? <CheckCircle2 /> : <XCircle />}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.userAttributes.certificates?.length ? (
                      <CheckCircle2 />
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle />{' '}
                        {user.role === Role.USER &&
                          user.createdAt &&
                          new Date(user.createdAt).getTime() <=
                            new Date().getTime() - 7 * 24 * 60 * 60 * 1000 && (
                            <Button
                              className="ml-2"
                              size="sm"
                              variant="outline"
                              title={user.createdAt}
                              onClick={() => handleNotifyUser(user)}>
                              Notify via email
                            </Button>
                          )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button className="ml-2" size="sm" variant="outline">
                      <Link href={`users/profile/${user.id}`}>Edit</Link>
                    </Button>
                    {user.role === Role.USER && (
                      <Button
                        className="ml-2"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setUserIdToDelete(user.id);
                          setDialogOpen(true);
                        }}>
                        Delete
                      </Button>
                    )}
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
                              Are you sure you want to delete user ID:{' '}
                              {userIdToDelete}.
                            </p>
                          </div>
                        </div>
                        <div className="justify-center px-4 py-3 sm:flex sm:px-6">
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => deleteUser(userIdToDelete!)}>
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

type AdminUserHeaderProps = {
  searchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AdminUserHeader: React.FC<AdminUserHeaderProps> = ({ searchText }) => {
  return (
    <div className="w-full">
      <form>
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="w-full appearance-none bg-white pl-8 shadow-none md:w-2/3 lg:w-1/3"
            placeholder="Search users by email..."
            type="search"
            onChange={searchText}
          />
        </div>
      </form>
    </div>
  );
};

export default UserList;
