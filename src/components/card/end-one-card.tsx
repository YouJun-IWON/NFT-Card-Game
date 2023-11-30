'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const EndOneCard = ({ player1, player2 }: any) => {
  // 이기면 1 비기면 3

  const router = useRouter();

  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        winner :{' '}
        {player1 === '3' ? 'DRAW' : player1 === '1' ? 'GUEST' : 'ADMIN'}
      </h2>
      <Button onClick={() => router.push('/')}>end-one-card</Button>
    </div>
  );
};

export default EndOneCard;
