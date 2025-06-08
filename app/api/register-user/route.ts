import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const newUser = await req.json();
    const data = await fs.readFile(USERS_PATH, 'utf-8');
    const users = JSON.parse(data);
    // Check for duplicate email or phone
    if (users.some((u: any) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 });
    }
    if (users.some((u: any) => u.phone === newUser.phone)) {
      return NextResponse.json({ error: 'Số điện thoại đã được sử dụng' }, { status: 400 });
    }
    newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
