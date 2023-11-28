import { format } from 'date-fns';
import { Member, Message, Profile } from '@prisma/client';

import { ChannelWelcome } from './channel-welcome';
import { ChannelBuilding } from './channel-building';
import { db } from '@/lib/db';
import axios from 'axios';

import ShowRoom from './show-room';
import { currentProfile } from '@/lib/current-profile';
import { GameWelcome } from './game-welcome';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';


interface ChatMessagesProps {
  name: string;
  serverId: string;
}

export const RoomList = async ({ name, serverId }: ChatMessagesProps) => {
  const profile = await currentProfile();

  // TODO : 데이터 가져와서 보여주기 => 필터링 필요

  // TODO : 누르면 돈 입금 먼저 뜨고 => 확인되면 db 상태 바꾸고 => url로 입장

  if (name === 'One Card') {
    const rooms = await db.oneCardRoom.findMany({
      where: {
        status: 'READY',
      },
    });

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
    });

    const myDecks = await db.server.findMany({
      where: {
        profileId: profile!.id,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        owner: true,
      },
    });

    return (
      <div className='flex flex-col py-4 overflow-y-auto'>
        <ChannelWelcome name={name} />

        <div className='flex mt-auto flex-col-reverse flex-wrap gap-3 mx-auto p-5'>
          {rooms.map((room) => (
            <div key={room.id}>
              <ShowRoom
                room={room}
                server={server!}
                myDecks={myDecks}
                profile={profile}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === 'Announcement') {
    // Announcement list
    return (
      <div className='flex-1  flex flex-col py-4 overflow-y-auto'>
        <GameWelcome name={name} />
      </div>
    );
  }

  if (name === 'Seven Poker' || name === 'Blackjack') {
    return (
      <div className='flex-1  flex flex-col py-4 overflow-y-auto'>
        <ChannelBuilding name={name} />
      </div>
    );
  }

  // if (status === 'loading') {
  //   return (
  //     <div className='flex flex-col flex-1 justify-center items-center'>
  //       <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
  //       <p className='text-xs text-zinc-500 dark:text-zinc-400'>
  //         Loading Rooms...
  //       </p>
  //     </div>
  //   );
  // }

  // if (status === 'error') {
  //   return (
  //     <div className='flex flex-col flex-1 justify-center items-center'>
  //       <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
  //       <p className='text-xs text-zinc-500 dark:text-zinc-400'>
  //         Something went wrong!
  //       </p>
  //     </div>
  //   );
  // }

  return;
};
