require("dotenv").config();
const mongoose = require("mongoose");

async function connectMongoDb() {
	try {
		await mongoose.connect(`${process.env.MONGO_DB_URL}`);
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
}
connectMongoDb();

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const User = new Schema({
	user: String,
	email: { type: String, unique: true },
	password: String
});

const Todo = new Schema({
	userId: ObjectId,
	title: String,
	status: Boolean
})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todo', Todo);

module.exports = {
	UserModel,
	TodoModel
}