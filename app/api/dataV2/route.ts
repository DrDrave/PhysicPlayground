import { NextResponse } from "next/server";

const data = [{ id: 1, name: "Item 1 V2" }];

export async function GET() {
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const newItem = await request.json();
    newItem.id = data.length + 1;
    data.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
}
