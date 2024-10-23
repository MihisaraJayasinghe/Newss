import dbConnect from '../../../../lib/mongodb';
import News from '../../../../model/model';
import mongoose from 'mongoose';

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