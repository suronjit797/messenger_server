import gql from "graphql-tag";
import UserModel from "./user.model";
import * as userService from "./user.service";
import { LoginPayload, TUser } from "./user.interface";
import { apolloAuth } from "../../middleware/auth";

export const userTypeDefs = gql`
  # main user type
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  # register
  input CreateUserInput {
    name: String!
    email: String!
    role: String!
    password: String!
  }

  # login
  input LoginInput {
    email: String!
    password: String!
  }
  type LoginResponse {
    accessToken: String!
    refreshToken: String!
  }

  # user query
  type Query {
    users(limit: Int!): [User!]!
    user(id: ID!): User
  }

  # user mutation
  type Mutation {
    register(body: CreateUserInput!): User!
    login(body: LoginInput): LoginResponse!
    # deleteUser(id: ID!): Boolean!
  }
`;

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, { req }: any) => {
      await apolloAuth(req, 'admin');
      return await userService.getAll_service()
    },
    user: async (_: any, { id }: { id: string }, { req }: any) => {
      await apolloAuth(req);
      return await userService.getSingle_service(id);
    },
  },
  Mutation: {
    register: async (_: any, { body }: { body: TUser }) => await userService.createUserService(body),
    login: async (_: any, { body }: { body: LoginPayload }) => await userService.loginService(body),

    // deleteUser: async (_: any, { id }: { id: string }) => {
    //   const result = await UserModel.findByIdAndDelete(id);
    //   return !!result; // Return `true` if the user was deleted, `false` otherwise
    // },
  },
};
