require('dotenv').config();
const express = require('express');
const { UserModel, TodoModel } = require("./db");
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { z } = require('zod');



app.use(express.json());
app.post('/signup', async function (req, res) {

	const signupSchema = z.object({
		username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters"),
		email: z.string().email("Invalid email format"),
		password: z.string().min(5, { message: "Password must be at least 5 characters long" })
			.max(20, { message: "Password cannot exceed 20 characters" })
			.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
			.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
			.regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
	});

	const parsedData = signupSchema.safeParse(req.body);
	if (!parsedData.success) {
		res.status(400).json({
			message: 'Incorrect formate',
			error: parsedData.error,
		});
		return;
	}


	const user = req.body.username;
	const userEmail = req.body.email;
	const pass = req.body.password;

	const hashedPassword = await bcrypt.hash(pass, 10);
	try {
		await UserModel.create({
			user: user,
			email: userEmail,
			password: hashedPassword
		});

		res.status(201).json({
			message: "You are signed up."
		});

	} catch (error) {
		res.status(500).json({
			message: "Error : " + error,
		});
	}

})


app.post('/signin', async function (req, res) {
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await UserModel.findOne({
			email: email,
		});

		if (!user) {
			return res.status(403).json({ message: "Invalid email or password." });
		}

		const passwordMatch = bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(403).json({ message: "Invalid email or password." });
		}

		const token = jwt.sign(
			{ id: user._id.toString() },
			process.env.JWT_SCREAT,
			{ expiresIn: '1d' }
		);

		res.status(200).json({
			token,
		});

	} catch (error) {
		console.error("Signin Error:", error);
		res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
	}
})


app.listen(3000);