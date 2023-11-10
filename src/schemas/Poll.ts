import mongoose, { Schema } from "mongoose";
import { IPoll } from "../types";

const PollSchema = new Schema<IPoll>({
    guildID: {required:true, type: String},
    messageID: {type: String},
    pollResult: {type: [Number], default: []},
    usersID: {type: [String], default: []}
})

const db = mongoose.connection.useDb(process.env.BOT_DATABASE)
const PollModel = db.model("poll", PollSchema, "polls")

export default PollModel