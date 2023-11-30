import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type, url, deck1, deck1Name, deck1Image } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.oneCardRoom.create({
      data: {
        name,
        deck1,
        deck1Name,
        deck1Image,
        deck2: '',
        deck2Name: '',
        deck2Image: '',
        player1: profile.id,
        player1Address: profile.address,
        player1Image: profile.imageUrl,
        player2: '',
        player2Address: '',
        player2Image: '',
        type,
        url,
        check1: true,
        check2: false,
        winner: '',
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNELS_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

