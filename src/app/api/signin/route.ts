import bcrypt from "bcryptjs";
import pool from "../../dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface User {
  id: number;
  username: string;
  email: string;
  // Add other properties as needed
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log({ email, password });

    // Retrieve the user from the database based on the email
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const selectData = [email];
    console.log(selectData);

    const [rows] = await pool.query(selectQuery, selectData);

    console.log("Rows:", rows);

    const typedRows = rows as RowDataPacket[];
    const rowDataPacket: RowDataPacket | undefined = typedRows[0];
    console.log("rowDataPacket:", rowDataPacket);

    const user: User | undefined = rowDataPacket
      ? {
        id: rowDataPacket.id,
        username: rowDataPacket.username,
        email: rowDataPacket.email,
      }
      : undefined;

    console.log("user:", user);

    if (!user) {
      // User does not exist
      return new NextResponse(
        JSON.stringify({ error: "User does not exist" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcrypt.compare(password, rowDataPacket.password);

    if (!isPasswordValid) {
      // Password is invalid
      return new NextResponse(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // If the code reaches this point, the password is valid
    console.log("Password is valid. Proceed with authentication.");

    // Create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // Create token
    const token = await jwt.sign(
      tokenData,
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1d" }
    );

    const response = new NextResponse(
      JSON.stringify({ message: "successful response", success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Error in fetching" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


