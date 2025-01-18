import gql from "graphql-tag";

export const globalTypeDefs = gql`
  scalar Date
  scalar JSON

  enum SortOrder {
    asc
    ascending
    desc
    descending
  }
  input PaginationInput {
    page: Int
    limit: Int
    sortOrder: SortOrder
    sortBy: String
  }

  type MetaQuery {
    page: Int!
    limit: Int!
    total: Int!
  }
`;

export const globalResolvers = {
  Query: {},
  Mutation: {},
};
