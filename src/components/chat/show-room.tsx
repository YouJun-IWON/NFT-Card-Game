'use client';
import { useModal } from '@/hooks/use-modal-store';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserAvatar } from '../user-avatar';
import { Button } from '../ui/button';
import { SetOneCardRoom, SetServer } from '@/types';

// TODO: 서버 데이터를 받아오고 싶은데... server 데이터를 어떻게 얻지?

const ShowRoom = ({
  room,
  server,
  myDecks,
  profile,
}: SetOneCardRoom & SetServer & any) => {
  const { onOpen } = useModal();

  return (
    <Card className=' w-[300px]' key={room.id}>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <p>{room.name}</p>

          <UserAvatar src={room.player1Image} />
        </CardTitle>
      </CardHeader>
      <CardContent className='break-all'>{room.player1Address}</CardContent>

      <CardFooter className='flex justify-between'>
        <Button
          disabled={room.player1Address === profile.address}
          onClick={() => onOpen('joinGame', { room, server, myDecks, profile })}
        >
          Join Game
        </Button>
        <UserAvatar src={room.deck1Image} />
      </CardFooter>
    </Card>
  );
};

export default ShowRoom;
