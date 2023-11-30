import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { finalValue } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.oneCardRoom.update({
      where: {
        id: finalValue,
      },
      data: {
        check1: true,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNELS_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
