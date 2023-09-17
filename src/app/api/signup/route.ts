import pool from "../../dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {


  try {
    const { username, email, password } = await request.json();
    console.log({ username, email, password });

    // Generate a hash of the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the pool has an active connection
    const connection = await pool.getConnection();
    connection.release(); // Release the connection immediately

    // If the code reaches this point, it means the connection was successful
    console.log("Connected to the database.");

    // Perform your insert query here
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const insertData = [username, email, hashedPassword];
    await pool.query(insertQuery, insertData);

    return NextResponse.json({ error: "Data inserted to table user" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error in fetching" }, { status: 500 });
  }
}




