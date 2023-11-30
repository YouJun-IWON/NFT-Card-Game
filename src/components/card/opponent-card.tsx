import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const OpponentCards = ({ cards }: any) => {
  return (
    <div className='relative flex justify-center w-full'>
      <div className='overflow-y-auto p-4 max-h-[200px] flex gap-2 flex-wrap'>
        {cards.map((card: any, index: any) => (
          <Image
            key={index}
            src={`/cardBlackBack/cardBlackBack.svg`}
            width={100}
            height={100}
            alt='opponent cards'
          />
        ))}

        <Badge className='absolute min-w-[150px] flex justify-center left-0 top-40 text-md mt-4 ml-4'>
          Cards Count : {cards.length}
        </Badge>
      </div>
    </div>
  );
};

export default OpponentCards;
