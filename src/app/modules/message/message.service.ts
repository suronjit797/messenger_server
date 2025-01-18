import MessageModel from "./message.model";
import globalService from "../../global/global.service";
import { IMessage } from "./message.interface";
import { io } from "../../../Scoket";
import { Types } from "mongoose";
import ActiveUserModel from "../activeUser/activeUser.model";
import { SEND_MESSAGE } from "../../../constants/constantsVars";

const messageServices = globalService(MessageModel);
messageServices.create = async (body: IMessage): Promise<Partial<IMessage> | null> => {
  const { users } = body;
  const message = await (await MessageModel.create(body)).populate("sender users");
  // realtime io setup
  if (users?.length > 0 && io) {
    const ids = users.map((id) => new Types.ObjectId(id as string));
    const receiverUsers = await ActiveUserModel.find({ userId: ids }).select({ socketId: 1, _id: 0 });
    const receiverIds = receiverUsers.map((r) => r.socketId);

    console.log({ receiverIds });

    if (receiverIds.length > 0) io.to(receiverIds).emit(SEND_MESSAGE, message);
  } else {
    console.log("message not send");
  }

  return message;
};

export default messageServices;
