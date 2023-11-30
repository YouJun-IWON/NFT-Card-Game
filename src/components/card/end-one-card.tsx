'use client';
import { useRouter } from 'next/navigation';

const EndOneCard = ({ player1, player2 }: any) => {
  const router = useRouter();
  return <button onClick={() => router.push('/')}>end-one-card</button>;
};

export default EndOneCard;
