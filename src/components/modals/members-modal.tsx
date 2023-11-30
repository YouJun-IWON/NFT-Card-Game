'use client';

import axios from 'axios';
import qs from 'query-string';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Heart,
  Spade,
  Diamond,
  Club,
  Asterisk,
  SquareAsterisk,
} from 'lucide-react';
import { useState } from 'react';
import { MemberRole } from '@prisma/client';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import convertToCards from '@/lib/cardsConvert';
import { cn } from '@/lib/utils';
import { pockerCards } from '@/constants/pockerCard';

import swapCards from '@/lib/cardSwap';
import Image from 'next/image';

// TODO: 사용자가 소유하고 있는, 그리고 이 화면에서 선택된 Collection의 모든 NFT를 가져온다.
// TODO: 기존에 미리 설정되어 있는 NFT를 제외하고 나머지 NFT를 보여준다.
// TODO: 카드이름은 추후에 따로 db를 만들어서 적용하자

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState(false);

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const cards = server?.cards.split(',');


  const viewCards: any = Object.assign({}, cards);

  const objectCard = convertToCards(viewCards);

  const onRoleChange = async (memberId: string, role: number) => {
    try {
      setLoadingId(true);

      const newRole = swapCards(cards, Number(memberId), role)?.join(',');

    
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { newRole });

      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(false);
    }
  };

  console.log(objectCard);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Manage NFT Poker Card
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {/* {server?.members?.length} Cards */}
            Your {server?.collection} Collection includes {cards?.length} NFTs
          </DialogDescription>
        </DialogHeader>

        {/* TODO: check */}
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {objectCard?.map((card, index) => (
            <div key={index} className='flex items-center gap-x-2 mb-6'>
              {/* <UserAvatar src={member.profile.imageUrl} /> */}
              <Image src={card.name} width={50} height={50} alt='NFT Image' className='rounded-md'/>
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  NFT name
                  {card.shape === 'spade' && (
                    <Spade className='w-4 h-4' fill='black' />
                  )}
                  {card.shape === 'heart' && (
                    <Heart fill='red' className='w-4 h-4 text-red-500' />
                  )}
                  {card.shape === 'club' && (
                    <Club fill='black' className='w-4 h-4 ' />
                  )}
                  {card.shape === 'diamond' && (
                    <Diamond fill='red' className='w-4 h-4 text-red-500' />
                  )}
                  {card.id === '52' || card.id === '53' ? (
                    <p
                      className={cn(
                        card.id === '52' ? 'text-black' : 'text-red-500'
                      )}
                    >
                      JOKER
                    </p>
                  ) : (
                    <p
                      className={cn(
                        card.shape === 'heart' || card.shape === 'diamond'
                          ? 'text-red-500 text-[15px]'
                          : 'text-black-800 text-[15px]'
                      )}
                    >
                      {card.num}
                    </p>
                  )}
                </div>
                <p className='text-xs text-zinc-500'>attribute</p>
              </div>

              <div className='ml-auto'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className='h-4 w-4 text-zinc-500' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='left'>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='flex items-center'>
                        <Spade className='w-4 h-4 mr-2' />
                        <span>Spade</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {pockerCards.spade.map((spade, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => onRoleChange(card.id, i)}
                            >
                              <Spade className='h-4 w-4 mr-2' />
                              {spade.rank}
                              {card.shape === 'spade' &&
                                card.id === i.toString() && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='flex items-center'>
                        <Diamond fill='red' className='w-4 h-4 mr-2' />
                        <span>Diamond</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {pockerCards.diamond.map((diamond, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => onRoleChange(card.id, i + 39)}
                            >
                              <Diamond fill='red' className='h-4 w-4 mr-2' />
                              {diamond.rank}
                              {card.shape === 'diamond' &&
                                card.id === (i + 39).toString() && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='flex items-center'>
                        <Club className='w-4 h-4 mr-2' />
                        <span>Club</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {pockerCards.club.map((club, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => onRoleChange(card.id, i + 26)}
                            >
                              <Club className='h-4 w-4 mr-2' />
                              {club.rank}
                              {card.shape === 'club' &&
                                card.id === (i + 26).toString() && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='flex items-center'>
                        <Heart fill='red' className='w-4 h-4 mr-2' />
                        <span>Heart</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {pockerCards.heart.map((heart, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => onRoleChange(card.id, i + 13)}
                            >
                              <Heart fill='red' className='h-4 w-4 mr-2' />
                              {heart.rank}
                              {card.shape === 'heart' &&
                                card.id === (i + 13).toString() && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onRoleChange(card.id, 52)}>
                      <Asterisk className='h-4 w-4 mr-2' />
                      JOKER
                      {card.shape === undefined && card.num === 'A' && (
                        <Check className='h-4 w-4 ml-auto' />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onRoleChange(card.id, 53)}>
                      <SquareAsterisk fill='red' className='h-4 w-4 mr-2' />
                      JOKER
                      {card.shape === undefined && card.num === '2' && (
                        <Check className='h-4 w-4 ml-auto' />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {loadingId === true && (
                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
