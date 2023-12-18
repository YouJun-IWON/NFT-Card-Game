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

import { useOrigin } from '@/hooks/use-origin';

import { ethers } from 'ethers';
import { abi } from '@/constants/abi';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import CardLayout from '../card/LayoutDesignCard';

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
export const CustomizingModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const origin = useOrigin();

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const isModalOpen = isOpen && type === 'customizing';

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
            Customizing Deck
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6 w-full  items-center justify-center'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg'>Choose Game Field NFT</FormLabel>
                    <Tabs defaultValue='account' className='w-[450px] mx-auto'>
                      <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='account'>
                          KlayOne Origin
                        </TabsTrigger>
                        <TabsTrigger value='password'>
                          First Edition
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value='account'>
                        <Card>
                          <CardContent className='flex items-center justify-center py-4'>
                            <Image
                              src='/klayone.png'
                              width={300}
                              height={300}
                              alt='klayone'
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value='password'>
                        <Card>
                          <CardContent  className='flex items-center justify-center py-4'>
                          <Image
                              src='/2222.png'
                              width={300}
                              height={300}
                              alt='2222'
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg'>Choose Poker Layout NFT</FormLabel>

                    <div className='grid grid-cols-3 gap-4'>

                        <CardLayout item={'/pokerCardBlack/AS.png'}/>
                        <CardLayout item={'/pokerCardWhite/AS.png'}/>
                        {/* <CardLayout item={'/show1.png'}/>
                        <CardLayout item={'/show2.png'}/>
                        <CardLayout item={'/show3.png'}/>
                        <CardLayout item={'/show4.png'}/> */}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
