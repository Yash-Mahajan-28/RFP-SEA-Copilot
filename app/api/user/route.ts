import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken, type User } from '@/lib/auth';
import { ObjectId } from 'mongodb';

function getAuthToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const [type, token] = auth.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const db = await getDatabase();
    const users = db.collection<User>('users');
    const user = await users.findOne({ _id: new ObjectId(payload.userId) });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user: { id: user._id?.toString(), name: user.name, email: user.email, accountType: user.accountType } });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { name, email, accountType } = body as Partial<User>;

    const update: any = { updatedAt: new Date() };
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (accountType && (accountType === 'individual' || accountType === 'business')) update.accountType = accountType;

    const db = await getDatabase();
    const users = db.collection<User>('users');
    const userId = new ObjectId(payload.userId);

    await users.updateOne({ _id: userId }, { $set: update });
    const user = await users.findOne({ _id: userId });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user: { id: user._id?.toString(), name: user.name, email: user.email, accountType: user.accountType } });
  } catch (error) {
    console.error('PUT /api/user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
