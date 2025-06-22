import React, { useState, useEffect, useRef } from 'react';
import { UserDto } from '@/services/user/dto/user.dto';
import findUsers, { Sort } from '@/services/user/find';
import { Role } from '@/app/register/types';
import { debounce } from 'lodash';
import deleteUser from '@/services/user/delete';
import { toast } from 'react-toastify';

type UseUserListProps = {
  initialSort?: Sort;
  initialFilter?: string;
  initialFilterKeys?: string | string[];
  initialPage?: number;
  initialRole?: Role;
  populateCertificates?: boolean;
};

const prepareFilter = (filter: string, filterKeys: string | string[]) => {
  if (!filterKeys) return filter;

  if (Array.isArray(filterKeys)) {
    return filterKeys.reduce((acc, key) => {
      return { ...acc, [key]: filter };
    }, {});
  }

  return { [filterKeys]: filter };
};

export const useUserList = ({
  initialSort = { id: 'asc' },
  initialFilter = '',
  initialFilterKeys = 'email',
  initialPage = 0,
  initialRole = Role.USER,
  populateCertificates = false,
}: UseUserListProps) => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [sort, setSort] = useState<Sort>(initialSort);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await findUsers({
          page,
          sort: Object.keys(sort)[0],
          dir: Object.values(sort)[0],
          type: initialRole,
          populateCertificates,
          ...(filter && { filter: prepareFilter(filter, initialFilterKeys) }),
        });

        setUsers(data.data);
        setTotalPageNumber(Math.ceil(data.meta.count / data.meta.take));
      } catch (e) {
        setUsers([]);
      }
    };

    fetchUsers();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, filter]);

  const sortUsers = (key: string) => {
    if (sort[key]) {
      setSort({ [key]: sort[key] === 'asc' ? 'desc' : 'asc' });
      return;
    }

    const _sort: Sort = { [key]: 'asc' };
    setSort(_sort);
  };

  const debounceSearch = useRef(
    debounce((criteria) => {
      setFilter(criteria);
      setPage(0);
    }, 500)
  ).current;

  const searchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value);
  };

  const _deleteUser = async (id: number) => {
    try {
      await deleteUser(id.toString());
      setUsers(users.filter((user) => user.id !== id));
      toast('User profile deleted', { type: 'success' });
    } catch (e) {
      toast('Something went wrong. Please try again', { type: 'error' });
    } finally {
      setDialogOpen(false);
    }
  };

  return {
    users,
    page,
    setPage,
    sort,
    setSort,
    filter,
    setFilter,
    totalPageNumber,
    isDialogOpen,
    setDialogOpen,
    userIdToDelete,
    setUserIdToDelete,
    sortUsers,
    searchText,
    deleteUser: _deleteUser,
  };
};
