import { DefaultEventsMap, Server } from "socket.io";
import { server } from "./server";
import { decodeToken } from "./app/middleware/auth";
import UserModel from "./app/modules/user/user.model";
import ActiveUserModel from "./app/modules/activeUser/activeUser.model";
import { GET_ACTIVE_USERS, MESSAGE_INPUT_FOCUSED, MESSAGE_TYPING } from "./constants/constantsVars";

export const activeUsers: { [key: string]: string } = {};

export let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

const initSocket = async () => {
  // Socket.IO Configuration
  try {
    io = new Server(server, {
      connectionStateRecovery: {},
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", async (socket) => {
      const token = socket.handshake.auth.token;
      const user = await decodeToken(token);

      if (!token || !user || !user?._id) {
        console.log("Unauthorized connection attempt");
        socket.disconnect();
        return;
      }

      // connected user
      console.log(`New client connected`, socket.id, user.name);
      // activeUsers[user._id] = socket.id;
      const a = await ActiveUserModel.updateMany(
        { userId: user._id },
        { userId: user._id, socketId: socket.id },
        { new: true, upsert: true }
      );

      await UserModel.findByIdAndUpdate(user._id, { isActive: true }, { new: true });

      io.emit(GET_ACTIVE_USERS, { user });

      // typing...
      socket.on(MESSAGE_INPUT_FOCUSED, async ({ status, userId }) => {
        if (userId) {
          console.log(userId);
          const receiverUsers = await ActiveUserModel.find({ userId }).select({ socketId: 1, _id: 0 });
          const receiverIds = receiverUsers.map((r) => r.socketId);
          io.to(receiverIds).emit(MESSAGE_TYPING, { typing: Boolean(status) });
        }
      });

      // disconnect
      socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id, user.name);
        // user?._id && delete activeUsers[user._id];
        const a = await ActiveUserModel.deleteMany({ userId: user._id, socketId: socket.id });

        await UserModel.findByIdAndUpdate(user._id, { isActive: false, lastActive: Date.now() }, { new: true });
        io.emit(GET_ACTIVE_USERS, { user });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export default initSocket;
