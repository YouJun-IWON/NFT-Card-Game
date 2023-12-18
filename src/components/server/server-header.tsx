'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Spade,
  Heart,
  Users,
  Diamond,
  Club,
  SquareAsterisk,
  User,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
  roomStatus?: any;
}

export const ServerHeader = ({
  server,
  role,
  roomStatus,
}: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            disabled
            onClick={() => onOpen('invite', { server })}
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <User className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server })}
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Deck Cover Settings
            <Spade className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Edit NFT Card
            <Diamond className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('customizing', { server })}
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Customizing Deck
            <Heart className='h-4 w-4 ml-auto fill' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            disabled={roomStatus.length > 0}
            onClick={() => onOpen('createChannel', { server })}
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Create Card Game
            <Club className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('deleteServer', { server })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Delete Deck
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('leaveServer', { server })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Leave Game
            <LogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
