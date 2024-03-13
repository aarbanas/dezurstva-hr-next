import { APIs, get } from '@/shared/http-service/httpService';
import { FindUsersDto } from '@/services/user/dto/findUsers.dto';

export type Sort = {
  [key: string]: 'asc' | 'desc';
};

type FindUsersQueryData = {
  page?: number;
  limit?: number;
  sort?: string;
  dir?: 'asc' | 'desc';
  filter?: object;
};

const findUsers = async (data?: FindUsersQueryData) => {
  const searchParams = new URLSearchParams();

  if (data) {
    if (data.page) searchParams.append(`page`, data.page.toString());
    if (data.limit) searchParams.append(`limit`, data.limit.toString());
    if (data.sort) searchParams.append(`sort`, data.sort);
    if (data.dir) searchParams.append(`dir`, data.dir);
    if (data.filter) {
      Object.entries(data.filter).forEach(([key, value]) => {
        searchParams.append(`filter[${key}]`, value);
      });
    }
  }

  return get<FindUsersDto>(`${APIs.USER}?${searchParams}`);
};

export default findUsers;
