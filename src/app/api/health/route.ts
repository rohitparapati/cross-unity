import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    name: 'cross-unity',
    timestamp: new Date().toISOString(),
  });
}