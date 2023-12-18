import Image from 'next/image';

const CardLayout = ({ item }: any) => {
  return (
    <div className='group overflow-hidden relative rounded-lg p-[3px] flex justify-center items-center  '>
      <div className='animate-spin rounded-lg hidden group-hover:block animate-gradient w-[110%] h-[220%] absolute -top-[60%] -left-[50%] bg-gradient-to-r from-zinc-900 via-gray-200/40 to-zinc-700 shadow-xl'>
        {' '}
      </div>

      <div className='relative w-full max-w-sm bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 cursor-pointer z-8 '>
        <div className='relative'>
          <div className='w-full h-[20vh]' style={{ position: 'relative' }}>
            <Image
              className='mb-3 rounded-t-lg'
              src={item}
              alt={`deck layout image`}
              style={{ objectFit: 'cover' }}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
