export async function onRequest(context) {
  const { params, env } = context;
  const path = params.path.join('/');
  
  try {
    // Get object from R2
    const object = await env.PAINTINGS_BUCKET.get(path);
    
    if (!object) {
      return new Response('Image not found', { status: 404 });
    }
    
    // Return the image with proper headers
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
