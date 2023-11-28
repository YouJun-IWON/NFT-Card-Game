import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
  name: string;
}

export const GameWelcome = ({ name }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4 flex flex-col justify-center items-center h-full'>
      <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
        <Hash className='h-12 w-12 text-white' />
      </div>

      <p className='text-xl md:text-3xl font-bold'>
        {'Welcome to '}
        NFT Poker Game 🎉
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        If you are a participant in the game room, click MEMBER on the left to
        proceed with the game!
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        Or, create a game room and play games with your opponents!
      </p>
    </div>
  );
};
