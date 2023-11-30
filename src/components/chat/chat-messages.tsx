'use client';

import { Fragment, useRef, ElementRef } from 'react';
import { format } from 'date-fns';
import { Member, Message, Profile } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';

import OpponentCards from '../card/opponent-card';
import CenterCards from '../card/center-card';

import MyCardsSocket from '../card/my-card-socket';
import MyCardsSocketAdmin from '../card/my-card-socket-admin';

import StartGame from './start-game';
import EndOneCard from '../card/end-one-card';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

// TODO: 여기서 보여주던가 하자 => conversation에 초기 값들이 들어 가 있고, 각각 번갈아가면서 카드를 넣을 때,

// TODO: 밑의 타입 적용시키기
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  member: Member;
  chatId: string;
  serverId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  deck: any;
}

export const ChatMessages = ({
  serverId,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  deck,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });
  useChatSocket({ queryKey, addKey, updateKey });

  if (data === undefined) {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading game...
        </p>
      </div>
    );
  }

  if (data?.pages[0]?.items?.length === 0) {
    return (
      <StartGame
        member={member}
        socketUrl='/api/socket/direct-messages'
        socketQuery={socketQuery}
      />
    );
  }

  console.log('me', data);
  console.log('set', data?.pages[0]?.items[0]);

  const turnCheck = data?.pages[0]?.items[0]?.member.role;

  console.log('turn', turnCheck);

  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong!
        </p>
      </div>
    );
  }

  const socketPlayer1Deck = data?.pages[0]?.items[0].player1Deck.split(',');
  const socketPlayer2Deck = data?.pages[0]?.items[0].player2Deck.split(',');
  const socketCenterDeck = data?.pages[0]?.items[0].centerDeck.split(',');
  const socketShowDeck = data?.pages[0]?.items[0].showDeck.split(',');

  // const turn = data?.pages

  // player1Deck: setDeck[0].join(),
  //         player2Deck: setDeck[1].join(),
  //         centerDeck: 'end',
  //         showDeck: 'end',

  console.log('wefwefwef', deck);

  return (
    <>
      {socketCenterDeck.join() === 'end' ? (
        <EndOneCard
          player1={socketPlayer1Deck[0].join()}
          player2={socketPlayer2Deck[0].join()}
        />
      ) : (
        <div className='flex flex-col items-center justify-between h-full'>
          {member.role === 'ADMIN' ? (
            <OpponentCards cards={socketPlayer1Deck} />
          ) : (
            <OpponentCards cards={socketPlayer2Deck} />
          )}

          <CenterCards
            centerDeck={socketCenterDeck}
            showDeck={socketShowDeck}
          />

          {member.role === 'ADMIN' ? (
            <MyCardsSocketAdmin
              deck={deck}
              serverId={serverId}
              member={member}
              showDeck={socketShowDeck}
              type={turnCheck}
              apiUrl={socketUrl}
              query={socketQuery}
              cards={socketPlayer2Deck}
            />
          ) : (
            <MyCardsSocket
              deck={deck}
              serverId={serverId}
              member={member}
              showDeck={socketShowDeck}
              type={turnCheck}
              apiUrl={socketUrl}
              query={socketQuery}
              cards={socketPlayer1Deck}
            />
          )}
        </div>
      )}
    </>
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

// socketPlayer1Deck.length === 7 &&
//       socketPlayer2Deck.length === 7 &&
//       socketCenterDeck.length === 37 &&
//       socketShowDeck.length === 1 ? (
//         <FirstTurn
//           player1Deck={socketPlayer1Deck}
//           player2Deck={socketPlayer2Deck}
//           centerDeck={socketCenterDeck}
//           showDeck={socketShowDeck}
//           member={member}
//           chatId={chatId}
//           type='conversation'
//           apiUrl='/api/direct-messages'
//           paramKey='conversationId'
//           paramValue={paramValue}
//           socketUrl='/api/socket/direct-messages'
//           socketQuery={socketQuery}
//         />
//       ) :
