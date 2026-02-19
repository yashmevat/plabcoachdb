
import { NextResponse } from 'next/server';

function getPath(params) {
  // Defensive: params.path can be undefined or not an array
  if (!params || !params.path) return '';
  if (Array.isArray(params.path)) return params.path.join('/');
  return params.path;
}

export async function GET(req, { params }) {
  const path = getPath(params);
  const url = `https://plabcoachdb.vercel.app/${path}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const contentType = res.headers.get('content-type') || 'application/json';
    const text = await res.text();
    // Try to parse JSON if content-type is JSON
    let body = text;
    if (contentType.includes('application/json')) {
      try {
        body = text ? JSON.parse(text) : {};
        return NextResponse.json(body, { status: res.status });
      } catch (e) {
        // If JSON parse fails, return as text
        return new NextResponse(text, {
          status: res.status,
          headers: { 'Content-Type': contentType },
        });
      }
    }
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error', details: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const path = getPath(params);
  const url = `https://plabcoachdb.vercel.app/${path}`;
  try {
    const body = await req.text();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
      },
      body,
    });
    const contentType = res.headers.get('content-type') || 'application/json';
    const text = await res.text();
    let responseBody = text;
    if (contentType.includes('application/json')) {
      try {
        responseBody = text ? JSON.parse(text) : {};
        return NextResponse.json(responseBody, { status: res.status });
      } catch (e) {
        return new NextResponse(text, {
          status: res.status,
          headers: { 'Content-Type': contentType },
        });
      }
    }
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error', details: error.message, stack: error.stack }, { status: 500 });
  }
}
