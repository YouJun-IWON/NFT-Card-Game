import { currentUser, redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/db';
import shortenAddress from './shortenAddress';

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
      name: `${shortenAddress(user.web3Wallets[0].web3Wallet)}`,
      imageUrl: user.imageUrl,
      email: '',
      address: user.web3Wallets[0].web3Wallet,
    },
  });

  return newProfile;
};
