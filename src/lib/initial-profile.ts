import { currentUser, redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/db';

//! 로그인 

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: 'example@example.com',
      address: user.web3Wallets[0].web3Wallet,
    },
  });

  return newProfile;
};
