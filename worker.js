export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle /images/** routes
    if (path.startsWith('/images/')) {
      const imagePath = path.slice(1); // Remove leading '/' to get 'images/...'

      try {
        const object = await env.PAINTINGS_BUCKET.get(imagePath);

        if (!object) {
          return new Response('Image not found', { status: 404 });
        }

        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'ETag': object.httpEtag,
          },
        });
      } catch (error) {
        return new Response('Error loading image', { status: 500 });
      }
    }

    // Handle /data/** routes
    if (path.startsWith('/data/')) {
      const dataPath = path.slice('/data/'.length);

      try {
        const object = await env.PAINTINGS_BUCKET.get(`data/${dataPath}`);

        if (!object) {
          return new Response('Chunk not found', { status: 404 });
        }

        const data = await object.json();

        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        return new Response('Error loading data', { status: 500 });
      }
    }

    // Serve static assets from dist directory
    return env.ASSETS.fetch(request);
  },
};
