import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { userData } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(request: NextRequest): { id: string; email: string } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = userData[user.id] || {
    emergencyHistory: [],
    preferences: { language: 'en' },
  };

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { emergencyType, preferences } = await request.json();

    if (!userData[user.id]) {
      userData[user.id] = {
        emergencyHistory: [],
        preferences: { language: 'en' },
      };
    }

    if (emergencyType) {
      userData[user.id].emergencyHistory.push({
        type: emergencyType,
        timestamp: new Date().toISOString(),
      });
    }

    if (preferences) {
      userData[user.id].preferences = {
        ...userData[user.id].preferences,
        ...preferences,
      };
    }

    return NextResponse.json(userData[user.id]);
  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
