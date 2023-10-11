import { NextRequest, NextResponse } from "next/server";
import pool from '../../../dbConfig/dbConfig';



export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const PostId = params.orderId;
    console.log(PostId)
    const deleteQuery = 'DELETE FROM menu WHERE id = ?';
    const deleteData = [PostId];

    await pool.query(deleteQuery, deleteData);

    return new NextResponse(
      JSON.stringify({ message: 'Menu item deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}



export async function PUT(request: NextRequest, { params }: any) {
  try {
    const postId = params.orderId;
    const { name, price } = await request.json();
    console.log(postId, name, price)

    const updateQuery = 'UPDATE menu SET name = ?, price = ? WHERE id = ?';
    const updateData = [name, price, postId];

    await pool.query(updateQuery, updateData);

    return new NextResponse(
      JSON.stringify({ message: 'Menu item updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}