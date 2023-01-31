import { FindManyOptions } from 'typeorm';

export default function addPaginationToOptions<Entity>(options: FindManyOptions<Entity>, page = 1, take = 10) {
  page = page < 1 ? 1 : page;
  take = take < 1 ? 1 : take;
  const skip = (page - 1) * take;
  options.skip = skip;
  options.take = take;
  return options;
}
