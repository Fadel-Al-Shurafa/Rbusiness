import pool from "../../dbConfig/dbConfig";
import fs from 'fs';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Retrieve the user ID from cookies or session

  const formData = await req.formData();
  const formDataEntryValues = Array.from(formData.values());

  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === "object" && "arrayBuffer" in formDataEntryValue) {
      const file = formDataEntryValue as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());

      // Save the file to the public directory
      fs.writeFileSync(`public/${file.name}`, buffer);

      // Retrieve the name and price values from the form data
      const name = formData.get("name") as string;
      const price = parseFloat(formData.get("price") as string);
      const userId = parseFloat(formData.get("userId") as string);
      // Insert the menu item into the MySQL database
      const insertQuery = "INSERT INTO menu (name, price, img, user_id) VALUES (?, ?, ?, ?)";
      const insertData = [name, price, `${file.name}`, userId];

      await pool.query(insertQuery, insertData);
    }
  }

  return NextResponse.json({ success: true });
}


