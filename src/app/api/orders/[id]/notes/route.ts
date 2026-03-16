import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const { note } = await request.json();
    if (!note || !note.trim()) {
      return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
    }
    const noteObj = { _id: new ObjectId(), text: note.trim(), createdAt: new Date() };
    const db = await getDb();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $push: { notes: noteObj }, $set: { updatedAt: new Date() } } as any
    );
    if (result.matchedCount === 0) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Note added.", note: noteObj }, { status: 201 });
  } catch (err) {
    console.error("Add note error:", err);
    return NextResponse.json({ error: "Failed to add note." }, { status: 500 });
  }
}
