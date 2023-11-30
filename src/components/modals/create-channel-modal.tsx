'use client';

import qs from 'query-string';
import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GameType } from '@prisma/client';


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useOrigin } from '@/hooks/use-origin';

import { ethers } from 'ethers';
import { abi } from '@/constants/abi';
import { currentProfile } from '@/lib/current-profile';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine((name) => name !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(GameType),
});

// TODO: 하나만 생성할 수 있게 해야한다. 내 ID가 있는 room의 status가 READY 나 RUN이면 만들지 못하게 한다.
export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const origin = useOrigin();

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const isModalOpen = isOpen && type === 'createChannel';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: GameType.ONE,
    },
  });



  // useEffect(() => {
  //   if (channelType) {
  //     form.setValue('type', channelType);
  //   } else {
  //     form.setValue('type', ChannelType.TEXT);
  //   }
  // }, [channelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   



    const provider = new ethers.providers.Web3Provider(window.ethereum);

 
    await provider.send('eth_requestAccounts', []);

    
    const signer = provider.getSigner();

    const contractWithSigner = new ethers.Contract(
      '0x3523eCA3438cE8aCF4A6A10e3A0a74dD95CBC8c4',
      abi,
      signer
    );

    const gameRoom = await contractWithSigner.create_game({
      value: ethers.utils.parseEther('1'),
    });

    const txReceipt = await gameRoom.wait();

    console.log('Game room created:', txReceipt.logs[0].address);

    const newValues = {
      ...values,
      url: `${origin}/invite/${server?.inviteCode}`,
      deck1: server?.id,
      deck1Name: server?.name,
      deck1Image: server?.imageUrl,
      contract: txReceipt.logs[0].address.toString(),
    };
    try {
      const url = qs.stringifyUrl({
        url: '/api/game',
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, newValues);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Create Game Room
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Room name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter room name'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='Select a game type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className='capitalize'
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))} */}

                        <SelectItem value='ONE' className='capitalize'>
                          One Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
