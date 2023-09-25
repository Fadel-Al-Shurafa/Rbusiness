
import { NextRequest, NextResponse } from "next/server";
import pool from "../../dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        // Query the menu items from the MySQL table
        const query = 'SELECT * FROM menu';
        const [menuItems] = await pool.query(query);
        // Send the menu items as the response
        return new NextResponse(
            JSON.stringify({ message: "menu data found", menuItems }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
}

