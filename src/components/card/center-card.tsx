import Image from 'next/image';
import { Badge } from '../ui/badge';

const CenterCards = ({ centerDeck, showDeck }: any) => {
  return (
    <div className='flex w-full gap-7 items-center justify-center'>
      <Badge className=' min-w-[100px] flex justify-center  text-md'>
        Count: {centerDeck.length}
      </Badge>

      {centerDeck.length > 25 ? (
        <Image
          src='/centerDeck/back3.png'
          width={150}
          height={150}
          alt='centerDeck'
        />
      ) : centerDeck.length > 13 ? (
        <Image
          src='/centerDeck/back2.png'
          width={150}
          height={150}
          alt='centerDeck'
        />
      ) : centerDeck.length > 3 ? (
        <Image
          src='/centerDeck/back1.png'
          width={150}
          height={150}
          alt='centerDeck'
        />
      ) : (
        <Image
          src='/centerDeck/cardBlackBack.svg'
          width={150}
          height={150}
          alt='centerDeck'
        />
      )}

      <Image
        src={`/pokerCardBlack/${showDeck[showDeck.length - 1]}.png`}
        width={150}
        height={150}
        className='z-100'
        alt='centerDeck'
      />

      <Badge className=' min-w-[100px] flex justify-center  text-md'>
        Count: {showDeck.length}
      </Badge>
      {/* {showDeck.length > 25 ? (
        <div className='relative'>
          <Image
            src={`/pokerCardBlack/${showDeck[showDeck.length - 1]}.png`}
            width={150}
            height={150}
            className='z-90'
            alt='centerDeck'
          />
          <Image
            src='/centerDeck/back1.png'
            width={150}
            height={150}
            className='absolute z-0 inset-0 top-10'
            alt='centerDeck'
          />
        </div>
      ) : showDeck.length > 13 ? (
        <div className='relative'>
        <Image
          src={`/pokerCardBlack/${showDeck[showDeck.length - 1]}.png`}
          width={150}
          height={150}
          className='z-90'
          alt='centerDeck'
        />
        <Image
          src='/centerDeck/back1.png'
          width={150}
          height={150}
          className='absolute z-0 inset-0 top-10'
          alt='centerDeck'
        />
      </div>
      ) : showDeck.length > 3 ? (
        <div className='relative'>
        <Image
          src={`/pokerCardBlack/${showDeck[showDeck.length - 1]}.png`}
          width={150}
          height={150}
          className='z-90'
          alt='centerDeck'
        />
        <Image
          src='/centerDeck/back1.png'
          width={150}
          height={150}
          className='absolute z-0 inset-0 top-10'
          alt='centerDeck'
        />
      </div>
      ) : (
        <div className='relative'>
        <Image
          src={`/pokerCardBlack/${showDeck[showDeck.length - 1]}.png`}
          width={150}
          height={150}
          className='z-100'
          alt='centerDeck'
        />
        <Image
          src='/centerDeck/back1.png'
          width={150}
          height={150}
          className='absolute inset-0 top-10'
          alt='centerDeck'
        />
      </div>
      )} */}
    </div>
  );
};

export default CenterCards;
