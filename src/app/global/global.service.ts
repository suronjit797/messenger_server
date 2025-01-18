import { Model } from "mongoose";
import { IGetAll_service, IPagination, TFilter } from "../../shared/globalInterfaces";

const globalService = <TType>(
  ModelName: Model<TType, Record<string, unknown>>
): { create: Function; getSingle: Function; update: Function; remove: Function; getAll: Function } => {
  return {
    // create
    create: async (body: TType): Promise<TType | null> => {
      return await ModelName.create(body);
    },

    // get all
    getAll: async (pagination: IPagination, filter: Partial<TFilter>): Promise<IGetAll_service<TType[] | null>> => {
      const { page, limit, skip, sortCondition } = pagination;
      const data = await ModelName.find(filter).limit(limit).skip(skip).sort(sortCondition);
      const total = await ModelName.countDocuments(filter);
      return { data, meta: { page, limit, total } };
    },

    // get single
    getSingle: async (id: string): Promise<Partial<TType> | null> => {
      return await ModelName.findById(id);
    },

    // update single
    update: async (id: string, payload: Partial<TType>): Promise<TType | null> => {
      const data = await ModelName.findByIdAndUpdate(id, payload, { new: true });
      return data;
    },

    // remove single
    remove: async (id: string): Promise<any> => {
      const data = await ModelName.findByIdAndDelete(id);
      return data;
    },
  };
};

export default globalService;
