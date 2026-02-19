// src/app/api/[...path]/route.js

import { NextResponse } from 'next/server';

const TARGET_BASE = 'https://plabcoachdb.vercel.app';

function buildHeaders(req) {
  const headers = {
    'Content-Type': req.headers.get('content-type') || 'application/json',
  };
  // Auth/session cookies forward karo
  const cookie = req.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;

  const auth = req.headers.get('authorization');
  if (auth) headers['authorization'] = auth;

  return headers;
}

async function proxyRequest(req, params, method, body = null) {
  const { path } = await params;
  const joinedPath = Array.isArray(path) ? path.join('/') : path;
  
  // Query string bhi forward karo
  const searchParams = new URL(req.url).searchParams.toString();
  const url = `${TARGET_BASE}/${joinedPath}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const fetchOptions = {
      method,
      headers: buildHeaders(req),
    };
    if (body !== null) fetchOptions.body = body;

    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get('content-type') || 'application/json';
    const text = await res.text();

    if (contentType.includes('application/json')) {
      try {
        const parsed = text ? JSON.parse(text) : {};
        return NextResponse.json(parsed, { status: res.status });
      } catch {
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
    return NextResponse.json(
      { error: 'Proxy error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  return proxyRequest(req, params, 'GET');
}

export async function POST(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, params, 'POST', body);
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, params, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    },
  });
}
