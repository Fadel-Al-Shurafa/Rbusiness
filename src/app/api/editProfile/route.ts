import pool from "../../dbConfig/dbConfig";
import fs from 'fs';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const formDataEntries = Array.from(formData.entries());

  let profileFileName;
  let backgroundProfileFileName;

  for (const [fieldName, fieldValue] of formDataEntries) {
    if (typeof fieldValue === "object" && "arrayBuffer" in fieldValue) {
      const file = fieldValue as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (fieldName === "profileFile") {
        // This is the profile file
        fs.writeFileSync(`public/${file.name}`, buffer);
        profileFileName = file.name;
      } else if (fieldName === "backGroundProfileFile") {
        // This is the background profile file
        fs.writeFileSync(`public/${file.name}`, buffer);
        backgroundProfileFileName = file.name;
      }
    }
  }

  // Retrieve the name and price values from the form data
  const titleProfile = formData.get("titleProfile") as string;
  const userId = parseFloat(formData.get("userId") as string);

  // Insert the menu item into the MySQL database
  const insertQuery = "INSERT INTO userprofile (titleProfile, BGprofileFile, profileFile, user_id) VALUES (?, ?, ?, ?)";
  const insertData = [titleProfile, backgroundProfileFileName, profileFileName, userId];

  await pool.query(insertQuery, insertData);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const formDataEntries = Array.from(formData.entries());

  let profileFileName;
  let backgroundProfileFileName;

  for (const [fieldName, fieldValue] of formDataEntries) {
    if (typeof fieldValue === "object" && "arrayBuffer" in fieldValue) {
      const file = fieldValue as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (fieldName === "profileFile") {
        // This is the profile file
        fs.writeFileSync(`public/${file.name}`, buffer);
        profileFileName = file.name;
      } else if (fieldName === "backGroundProfileFile") {
        // This is the background profile file
        fs.writeFileSync(`public/${file.name}`, buffer);
        backgroundProfileFileName = file.name;
      }
    }
  }

  // Retrieve the name and price values from the form data
  const titleProfile = formData.get("titleProfile") as string;
  const userId = parseFloat(formData.get("userId") as string);

  // Insert the menu item into the MySQL database
  const updateQuery = "UPDATE userprofile SET titleProfile = ?, BGprofileFile = ?, profileFile = ?, user_id = ?";
  const updateData = [titleProfile, backgroundProfileFileName, profileFileName, userId];

  await pool.query(updateQuery, updateData);

  return NextResponse.json({ success: true });
}
