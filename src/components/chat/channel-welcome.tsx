import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
  name: string;
}

export const ChannelWelcome = ({ name }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4 flex flex-col justify-center items-center'>
      <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
        <Hash className='h-12 w-12 text-white' />
      </div>

      <p className='text-xl md:text-3xl font-bold'>
        {'Welcome to '}
        {name}
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        Join the room of your choice
      </p>
    </div>
  );
};
