export async function onRequest(context) {
  const { params, env } = context;
  const chunkFile = params.chunk.join('/');
  
  try {
    // Get JSON from R2
    const object = await env.PAINTINGS_BUCKET.get(`data/${chunkFile}`);
    
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
