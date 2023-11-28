'use client';

import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';

export const InviteCode = () => {
  const { data } = useModal();
  const origin = useOrigin();


  const { server } = data;



  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;



  return inviteUrl;
};
