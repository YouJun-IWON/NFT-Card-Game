import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { GameStatus } from '@prisma/client';

// TODO : 필터링 및 확인 진행하자

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const profile = await currentProfile();
    const { deck2, memberTwoId } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const check = await db.oneCardRoom.findUnique({
      where: {
        id: params.roomId,
      },
      select: {
        status: true,
      },
    });

    if (check?.status !== GameStatus.READY) {
      return new NextResponse('Already Start', { status: 400 });
    }

    const server = await db.oneCardRoom.update({
      where: {
        id: params.roomId,
      },
      data: {
        deck2,
        player2: profile.id,
        player2Address: profile.address,
        player2Image: profile.imageUrl,
        check2: true,
        status: GameStatus.RUN,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
