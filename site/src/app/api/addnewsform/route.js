import dbConnect from '../../../../lib/mongodb';
import News from '../../../../model/model';
import mongoose from 'mongoose';

// PUT Method: Update news by ID
export async function PUT(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract 'id' from query string

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid or missing News ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { title, content, category, author, imageUrl, videoUrl, tag } = body;

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, content, category, author, imageUrl, videoUrl, tag },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return new Response(JSON.stringify({ success: false, message: 'News not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: updatedNews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE Method: Delete news by ID
export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract 'id' from query string

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid or missing News ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return new Response(JSON.stringify({ success: false, message: 'News not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'News deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET Method: Search news by title or category
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title'); // Search by title
  const category = searchParams.get('category'); // Search by category

  try {
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (category) query.category = category;

    const news = await News.find(query);

    return new Response(JSON.stringify({ success: true, data: news }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}