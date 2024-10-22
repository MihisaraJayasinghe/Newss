// src/pages/api/news/route.js
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/mongodb'; // Adjust the path to your database connection utility
import News from '../../../../model/model'; // Adjust the path to your News model

export async function PATCH(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id, action, mediaPreference } = body;

    // Simple token-based authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (token !== 'admin-token') {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or missing article ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'pin') {
      // Unpin all other news articles by setting `stype` to null
      await News.updateMany({}, { stype: null });

      // Pin the selected news article and update media preference if provided
      const updateData = { stype: 'pinned' };
      if (mediaPreference) {
        updateData.mediaPreference = mediaPreference;
      }
      const pinnedNews = await News.findByIdAndUpdate(id, updateData, { new: true });
      return new Response(JSON.stringify({ success: true, data: pinnedNews, message: 'News article pinned successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'unpin') {
      const unpinnedNews = await News.findByIdAndUpdate(id, { stype: null }, { new: true });
      return new Response(JSON.stringify({ success: true, data: unpinnedNews, message: 'News article unpinned successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'updateMediaPreference' && mediaPreference) {
      // Update media preference for the specific article
      const updatedNews = await News.findByIdAndUpdate(id, { mediaPreference }, { new: true });
      return new Response(JSON.stringify({ success: true, data: updatedNews, message: 'Media preference updated' }), {
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


// src/pages/api/news/route.js
 
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, content, category, author, imageUrl, videoUrl } = body;

    // Simple token-based authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (token !== 'admin-token') {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const news = new News({
      title,
      content,
      category,
      author,
      imageUrl,
      videoUrl,
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


// src/pages/api/news/[id]/route.js

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    // Simple token-based authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (token !== 'admin-token') {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
