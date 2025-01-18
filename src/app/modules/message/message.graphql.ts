import gql from "graphql-tag";
import MessageModel from "./message.model";
import messageService from "./message.service";
import { GetAllMessages, MessagePaginationArgs, IMessage } from "./message.interface";
import { apolloAuth } from "../../middleware/auth";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import { GraphqlContext, IPagination } from "../../../shared/globalInterfaces";
import { Types } from "mongoose";
import * as userService from "../user/user.service";
import { io } from "../../../Scoket";
import ActiveUserModel from "../activeUser/activeUser.model";
import { SEND_MESSAGE } from "../../../constants/constantsVars";

export const messageTypeDefs = gql`
  # queries
  type Message {
    _id: ID!
    users: [User!]!
    message: String!
    sender: User!
    isGroup: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  # inputs
  input CreateMessageInput {
    users: [String!]!
    message: String!
  }

  input UpdateMessageInput {
    message: String!
  }

  input MessageQuery {
    users: JSON
    message: String
    sender: String
    isGroup: Boolean
    createdAt: String
    updatedAt: String
    search: String
  }

  type getAllMessagesQuery {
    meta: MetaQuery
    data: [Message!]
  }

  # query
  type Query {
    getMessages(pagination: PaginationInput, query: MessageQuery): getAllMessagesQuery!
    getMessage(id: ID!): Message
    getUserMessage(id: ID!, pagination: PaginationInput): getAllMessagesQuery
    # profile: Message
  }

  # mutation
  type Mutation {
    createMessage(body: CreateMessageInput!): Message!
    deleteMessage(id: ID!): Message!
    updateMessage(id: ID!, body: UpdateMessageInput): Message!
  }
`;

export const messageResolvers = {
  Message: {
    users: async (message: IMessage) => {
      // Pagination and filtering
      const page = paginationHelper({ limit: 100 });
      const filter = { _id: { $in: message.users } };

      // Fetch users
      const { data } = await userService.getAll_service(page, filter);
      return data;
    },
    sender: async (message: IMessage) => await userService.getSingle_service(message.sender),
  },
  Query: {
    getMessages: async (
      _: undefined,
      args: MessagePaginationArgs,
      context: GraphqlContext
    ): Promise<GetAllMessages> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req, "admin");

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new MessageModel(), ["name", "email"]);

      // Fetch messages
      return await messageService.getAll(page, filter);
    },

    // specific user message
    getUserMessage: async (
      _: undefined,
      args: { id: string; pagination: IPagination },
      context: GraphqlContext
    ): Promise<GetAllMessages> => {
      const { req, user } = context;
      // auth
      await apolloAuth(req);

      // const filter = { users: { $eq: [new Types.ObjectId(user?._id), new Types.ObjectId(args.id)] } };
      let users = [args.id, user?._id?.toString()].sort();
      users.forEach((user) => new Types.ObjectId(user));

      const filter = { users };
      const page = paginationHelper(args.pagination || {});
      console.log({users})
      return await messageService.getAll(page, filter);
    },

    getMessage: async (
      _: undefined,
      args: { id: string },
      context: GraphqlContext
    ): Promise<Partial<IMessage> | null> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Fetch single message
      return await messageService.getSingle(args.id);
    },
  },

  Mutation: {
    createMessage: async (
      _: undefined,
      args: { body: Partial<IMessage> },
      context: GraphqlContext
    ): Promise<IMessage | null> => {
      // Authorization
      await apolloAuth(context.req);

      const users = [...(args.body?.users || []), context.user?._id?.toString()].sort();
      // Register message
      const body: any = { users, sender: context.user?._id, message: args.body?.message };
      const message = await messageService.create(body);

      return message;
    },

    deleteMessage: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<IMessage> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req);

      // Delete message
      return await messageService.remove(args.id);
    },

    updateMessage: async (
      _: undefined,
      args: { id: string; body: Partial<IMessage> },
      context: GraphqlContext
    ): Promise<IMessage | null> => {
      const { req } = context;
      // Authorization
      await apolloAuth(req);
      // Update message
      return await messageService.update(args.id, args.body);
    },
  },
};
