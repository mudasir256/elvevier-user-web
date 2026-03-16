import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { id, noteId } = await params;
    const db = await getDb();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $pull: { notes: { _id: new ObjectId(noteId) } } } as any
    );
    if (result.matchedCount === 0) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Note deleted." });
  } catch (err) {
    console.error("Delete note error:", err);
    return NextResponse.json({ error: "Failed to delete note." }, { status: 500 });
  }
}
