import mongoose from 'mongoose';
import dbConnect from '../../../../lib/mongodb'; // Adjust the path to your database connection utility
import News from '../../../../model/model'; // Adjust the path to your News model

// Handle GET request to fetch all news articles
export async function GET(req) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const isPinned = searchParams.get('pinned'); // Check if pinned news is requested

    if (isPinned === 'true') {
      const pinnedNews = await News.findOne({ stype: 'pinned' });
      return new Response(JSON.stringify({ success: true, data: pinnedNews }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const news = await News.find({});
    return new Response(JSON.stringify({ success: true, data: news }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle POST request to create a new news article
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, content, category, author, imageUrl, videoUrl ,tag} = body;

    const news = new News({
      title,
      content,
      category,
      author,
      imageUrl,
      videoUrl,
      tag,
    });

    await news.save();

    return new Response(JSON.stringify({ success: true, data: news }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle PATCH request to pin/unpin a news article (set stype)
// Handle PATCH request to pin/unpin a news article
export async function PATCH(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id, action } = body; // action will be either 'pin' or 'unpin'

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or missing article ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'pin') {
      // Unpin all other news articles by setting `stype` to null
      await News.updateMany({}, { stype: null });
      // Pin the selected news article by setting `stype` to 'pinned'
      const pinnedNews = await News.findByIdAndUpdate(id, { stype: 'pinned' }, { new: true });
      return new Response(JSON.stringify({ success: true, data: pinnedNews, message: 'News article pinned successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'unpin') {
      // Unpin the selected news article by setting `stype` to null
      const unpinnedNews = await News.findByIdAndUpdate(id, { stype: null }, { new: true });
      return new Response(JSON.stringify({ success: true, data: unpinnedNews, message: 'News article unpinned successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle DELETE request to delete a news article
export async function DELETE(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or missing article ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return new Response(JSON.stringify({ success: false, message: 'News article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'News article deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
