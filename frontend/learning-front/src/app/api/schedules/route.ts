/** @format */

import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data); // デバッグ用に追加
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API fetch error:", error); // デバッグ用に追加
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req: Request) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`;
  const data = await req.json();

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      return NextResponse.json(
        { error: "レコードの作成に失敗しました" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
