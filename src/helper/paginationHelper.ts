import { SortOrder } from "mongoose";
import { IPagination, ISortCondition } from "../shared/globalInterfaces";

export const pic = <T extends object, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  const findObject: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      findObject[key] = obj[key];
    }
  }
  return findObject;
};

export const specialPic = <T extends object, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  const findObject: Partial<T> = {};



  // for (const key of keys) {
  //   if (obj && Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
  //     findObject[key] = obj[key];
  //   }
  // }
  console.log(findObject, obj, keys);
  return findObject;
};

export const paginationHelper = <T extends Record<string, unknown>>(obj: T): IPagination => {
  const keys: (keyof T)[] = ["page", "limit", "sortOrder", "sortBy"];
  const options = pic(obj, keys);

  const page: number = Math.abs(Number(options.page) || 1);
  const limit: number = Math.abs(Number(options.limit) || 10);
  const skip: number = (page - 1) * limit;
  const sortBy: string = (options.sortBy as string) || "createdAt";
  let sortOrder: SortOrder = (options.sortOrder as SortOrder) || "desc";

  const validSortOrderValues = [1, -1, "asc", "ascending", "desc", "descending"];

  if (!validSortOrderValues.includes(sortOrder)) {
    sortOrder = "desc";
  }

  const sortCondition: ISortCondition = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder as SortOrder;
  }

  return {
    page,
    limit,
    skip,
    sortCondition,
  };
};
