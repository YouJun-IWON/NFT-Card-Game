'use client';

import { Fragment, useRef, ElementRef } from 'react';
import { format } from 'date-fns';
import { Member, Message, Profile } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';


import { ChatWelcome } from './chat-welcome';
import { ChatItem } from './chat-item';
import { ChatInput } from './chat-input';
import { ChatInputAdmin } from './chat-input-admin';
import { judgeTrue } from '@/lib/gameMachine';
import OpponentCards from '../card/opponent-card';
import CenterCards from '../card/center-card';
import MyCards from '../card/my-card';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

// TODO: 상대방이 먼저 첫 수를 둔다. 이때 상대방 패는 잠겨 있어야 한다. 나의 패만 가능한 상태 여야 한다.

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  chatId: string;

  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
  member: Member;
  player1Deck: any;
  player2Deck: any;
  centerDeck: any;
  showDeck: any;
}

export const FirstTurn = ({

  player1Deck,
  player2Deck,
  showDeck,
  centerDeck,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  console.log('player1Deck', player1Deck);
  console.log('player2Deck', player2Deck);
  console.log('centerDeck', centerDeck);
  console.log('showDeck', showDeck);

  // console.log('filter', judgeTrue(showDeck, player1Deck));

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  //   useChatQuery({
  //     queryKey,
  //     apiUrl,
  //     paramKey,
  //     paramValue,
  //   });
  // useChatSocket({ queryKey, addKey, updateKey });

  // if (status === 'loading') {
  //   return (
  //     <div className='flex flex-col flex-1 justify-center items-center'>
  //       <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
  //       <p className='text-xs text-zinc-500 dark:text-zinc-400'>
  //         Loading messages...
  //       </p>
  //     </div>
  //   );
  // }

  // console.log('me', data);
  // console.log('set', data?.pages[0]?.items[0]);

  // const turn = data?.pages[0]?.items[0]?.member.profile.address;

  // const turnCheck = data?.pages[0]?.items[0]?.member.role;

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

  // const turn = data?.pages

  return (
    <div className='flex flex-col items-center justify-between h-full'>
      {member.role === 'ADMIN' ? (
        <OpponentCards cards={player1Deck} />
      ) : (
        <OpponentCards cards={player2Deck} />
      )}

      <CenterCards centerDeck={centerDeck} showDeck={showDeck}/>

      {member.role === 'ADMIN' ? (
        <MyCards
        member={member}
        showDeck={showDeck}
          type={type}
          apiUrl={socketUrl}
          query={socketQuery}
          cards={player2Deck}
        />
      ) : (
        <MyCards
        member={member}
        showDeck={showDeck}
          type={type}
          apiUrl={socketUrl}
          query={socketQuery}
          cards={player1Deck}
        />
      )}
    </div>
  );
};

// {turn !== profileAddress && (
//   <ChatInputAdmin
//     turnCheck={turnCheck}
//     name={name}
//     type={type}
//     apiUrl={socketUrl}
//     query={socketQuery}
//   />
// )}

//http://localhost:3000/invite/12563e7b-bb2c-4dde-b8a5-7ec58e504f7f
