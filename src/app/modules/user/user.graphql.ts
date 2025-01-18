import gql from "graphql-tag";
import UserModel from "./user.model";
import * as userService from "./user.service";
import { CreateUserInput, GetAllUsers, LoginPayload, LoginResponse, PaginationArgs, TUser } from "./user.interface";
import { apolloAuth } from "../../middleware/auth";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import { GraphQLResolveInfo } from "graphql";
import { GraphqlContext } from "../../../shared/globalInterfaces";

export const userTypeDefs = gql`
  # queries
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    avatar: String!
    isActive: Boolean
    lastActive: Date
    createdAt: String!
    updatedAt: String!
  }
  type LoginResponse {
    accessToken: String!
    refreshToken: String!
  }

  # inputs
  input CreateUserInput {
    name: String!
    email: String!
    role: String
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    role: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserQuery {
    _id: ID
    name: String
    email: String
    role: String
    createdAt: String
    updatedAt: String
    search: String
  }

  type getAllUsersQuery {
    meta: MetaQuery
    data: [User!]
  }

  # query
  type Query {
    users(pagination: PaginationInput, query: UserQuery): getAllUsersQuery!
    myChatUsers(pagination: PaginationInput, query: UserQuery): getAllUsersQuery!
    user(id: ID!): User
    profile: User
  }

  # mutation
  type Mutation {
    register(body: CreateUserInput!): User!
    login(body: LoginInput): LoginResponse!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, body: UpdateUserInput): User!
  }
`;

export const userResolvers = {
  Query: {
    users: async (_: undefined, args: PaginationArgs, context: GraphqlContext): Promise<GetAllUsers> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req, "admin");

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new UserModel(), ["name", "email"]);

      // Fetch users
      return await userService.getAll_service(page, filter);
    },
    myChatUsers: async (_: undefined, args: PaginationArgs, context: GraphqlContext): Promise<GetAllUsers> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new UserModel(), ["name", "email"]);

      // Fetch users
      return await userService.getAll_service(page, filter);
    },

    user: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<Partial<TUser> | null> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Fetch single user
      return await userService.getSingle_service(args.id);
    },

    profile: async (_: undefined, __: undefined, { user, req }: GraphqlContext): Promise<Partial<TUser> | null> => {
      // Authorization
      await apolloAuth(req);

      if (!user?._id) throw new Error("user not found");
      // Fetch profile
      return await userService.getSingle_service(user?._id);
    },
  },

  Mutation: {
    register: async (_: undefined, args: { body: CreateUserInput }): Promise<TUser | null> => {
      // Register user
      return await userService.createUserService(args.body);
    },

    login: async (_: undefined, args: { body: LoginPayload }): Promise<LoginResponse> => {
      // Login user
      return await userService.loginService(args.body);
    },

    deleteUser: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<TUser> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Delete user
      return await userService.remove_service(args.id);
    },

    updateUser: async (
      _: undefined,
      args: { id: string; body: Partial<TUser> },
      context: GraphqlContext
    ): Promise<TUser | null> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Update user
      return await userService.update_service(args.id, args.body);
    },
  },
};
