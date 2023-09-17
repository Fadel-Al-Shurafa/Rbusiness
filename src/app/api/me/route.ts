import { getDataFromToken } from "../../helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "../../dbConfig/dbConfig";

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    console.log(userId)
    // Retrieve the user from the database based on the user ID
    const selectQuery = "SELECT * FROM users WHERE id = ?";
    const selectData = [userId];
    const [rows] = await pool.query(selectQuery, selectData);

    const typedRows = rows as RowDataPacket[];
    const rowDataPacket: RowDataPacket | undefined = typedRows[0];

    if (!rowDataPacket) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract the relevant user data
    const user = {
      id: rowDataPacket.id,
      username: rowDataPacket.username,
      email: rowDataPacket.email,
      // Add other properties as needed
    };

    return new NextResponse(
      JSON.stringify({ message: "User found", data: user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}