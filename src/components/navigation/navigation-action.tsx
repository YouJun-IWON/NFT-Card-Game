'use client';

import { Plus } from 'lucide-react';
import { ActionTooltip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

// TODO: 여기서 실제로 NFT를 갖고 있는지 Collection 확인이 필요하다.

export const NavigationAction = () => {
  const { onOpen } = useModal();

  const collection = '';

  return (
    <div>
      <ActionTooltip side='right' align='center' label='Add a NFT Deck'>
        <button
          onClick={() => onOpen('createServer', {collection})}
          className='group flex items-center'
        >
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus
              className='group-hover:text-white transition text-emerald-500'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
