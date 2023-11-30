import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, imageUrl, collection, cards, owner } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        collection,
        address: profile.address,
        owner,
        cards,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: 'Announcement', profileId: profile.id },
            { name: 'One Card', profileId: profile.id },
            { name: 'Seven Poker', profileId: profile.id },
            { name: 'Blackjack', profileId: profile.id },
          ],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    

    return NextResponse.json(server);
  } catch (err) {
    console.log('[SERVERS_POST]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
