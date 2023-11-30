'use client';
import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OneCardRoom, Profile } from '@prisma/client';
import { ethers } from 'ethers';
import { abi } from '@/constants/abi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';

interface ChatWelcomeProps {
  result?: OneCardRoom;
  profile: Profile;
}

export function ShowMyResult({ result, profile }: ChatWelcomeProps) {
  const { onOpen } = useModal();

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Room Name : {result?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className='text-lg text-white'>
          Result :{result?.winner === profile.id ? 'WIN 😆' : 'lose 😅'}
        </span>
      </CardContent>
      <CardFooter className='flex justify-between'>
        {result?.winner === profile.id && result.check1 === true ? (
          <span className='text-3xl'>✅</span>
        ) : result?.winner === profile.id ? (
          <Button
            onClick={() => onOpen('checkReciept', { result, profile })}
            type='submit'
            variant='primary'
          >
            Get Earning
          </Button>
        ) : (
          <p></p>
        )}
      </CardFooter>
    </Card>
  );
}
