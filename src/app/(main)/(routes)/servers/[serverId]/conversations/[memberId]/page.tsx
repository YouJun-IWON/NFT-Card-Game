import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';

// import { MediaRoom } from '@/components/media-room';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  const guestMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      role: 'GUEST',
    },
    // include: {
    //   profile: true,
    // },
  });

  const adminMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      role: 'ADMIN',
    },
    // include: {
    //   profile: true,
    // },
  });

  // console.log('guest member', currentMember)
  // console.log('adminMember', adminMember)

  if (!currentMember) {
    return redirect('/');
  }
  if (!adminMember || !currentMember || !guestMember) {
    return redirect('/');
  }

  //! 도전자가 member 1이 된다.

  const memberOneId = guestMember.id;
  const memberTwoId = adminMember.id;

  const conversation = await getOrCreateConversation(
    memberOneId!,
    memberTwoId!
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  // const otherDeck =
  //   memberOne.profileId === profile.id ? player2Deck : player1Deck;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type='conversation'
      />

      <ChatMessages
       serverId={params.serverId}
        member={currentMember}
        chatId={conversation.id}
        apiUrl='/api/direct-messages'
        paramKey='conversationId'
        paramValue={conversation.id}
        socketUrl='/api/socket/direct-messages'
        socketQuery={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
