import { Hash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ChatWelcomeProps {
  name: string;
}

export const ChannelWelcome = ({ name }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4 flex flex-col justify-center items-center'>
      <div className='h-[100px] w-[100px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
        {/* <Hash className='h-12 w-12 text-white' /> */}
        <Image
          src='/title/OneCard.svg'
          width={100}
          height={100}
          alt='one card'
        />
      </div>

      <p className='text-xl md:text-3xl font-bold'>
        {'Welcome to '}
        {name}
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        Join the room of your choice. This is{' '}
        <Link className='underline text-blue-500' href='/ oneCardRule'>
          Game Rule
        </Link>
      </p>
    </div>
  );
};
