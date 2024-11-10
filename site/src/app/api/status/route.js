// app/api/status/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import News from '../../../../model/model';

export async function PUT(request) {
  await dbConnect();

  const { id, live } = await request.json();

  try {
    const updatedNews = await News.findByIdAndUpdate(id, { live }, { new: true });
    return NextResponse.json({ success: true, data: updatedNews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
