require("dotenv").config();
const mongoose = require("mongoose");

async function connectMongoDb() {
	try {
		await mongoose.connect(process.env.MONGO_DB_URL);
		console.log('Successfully connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
}

connectMongoDb();

const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
	user: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true }
});

// Todo Schema
const TodoSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	status: { type: Boolean, default: false }
});

// Create models
const UserModel = mongoose.model('User', UserSchema);
const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = {
	UserModel,
	TodoModel
};
