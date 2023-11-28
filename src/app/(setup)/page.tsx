import { InitialModal } from '@/components/modals/initial-modal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';

//TODO: NFT가 있는지 없는지 확인하고 소유하고 있는 덱을 확인하는 페이지
//TODO:  이 부분에서 백엔드에 주소와 함께 요청을 보낸다. 그리고 데이터를 받아온다. 
//TODO:  그 데이터를 Props로 넘겨 준다. 
const SetupPage = async () => {
  const profile = await initialProfile();

  const deckExisting = '';

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal deckExisting={deckExisting}/>;
};

export default SetupPage;
