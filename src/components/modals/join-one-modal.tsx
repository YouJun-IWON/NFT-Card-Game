'use client';

import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { UserAvatar } from '../user-avatar';
import { currentProfile } from '@/lib/current-profile';

// TODO: 자신이 갖고 있는 덱을 조회한다. 기존의 덱이 있으면
// TODO: 선택된 것에 대한 정보 밑에 보여주기 이기면 어떤 조건을 갖고 있는지도 확인
// TODO: join 버튼 을 누르면 결제 klay를 넣고 확인이 되면 db에 데이터를 넣고 게임

const formSchema = z.object({
  deck2: z.string().min(1, {
    message: 'Choose a Deck.',
  }),
});

export const JoinOneModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'joinGame';
  const { server, room, myDecks, profile } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deck2: '',
      deck2Name: '',
      deck2Image: '',
      player1: room?.player1,
    },
  });

  const selectedDeck = form.watch('deck2');

  useEffect(() => {
    if (server) {
      form.setValue('deck2', server.id);
      form.setValue('deck2Name', server.name);
      form.setValue('deck2Image', server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newValuse = { ...values, player1: room?.player1 };

    try {
      await axios.patch(`/api/join/${room?.id}`, newValuse);

      form.reset();
      router.push(room!.url);
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
            Check Join
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Please choose which status you would like to join in. And click the
            Join button.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='deck2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Deck</FormLabel>
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
                        {myDecks.map((deck: any) => (
                          <SelectItem
                            key={deck.id}
                            value={deck.id}
                            className='capitalize'
                          >
                            {deck.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedDeck && (
                <div>
                  {/* Display additional information about the selected deck */}
                  {myDecks?.map((deck: any) =>
                    deck.id === selectedDeck ? (
                      <div key={deck.id}>
                        <div className='flex justify-between items-center'>
                          <Avatar className='h-20 w-20'>
                            <AvatarImage src={deck.imageUrl} />
                          </Avatar>
                          <span className='flex flex-col'>
                            <p>Name: {deck.name}</p>
                            <p>
                              Win Prize:{' '}
                              {deck.owner === profile?.address ? '100%' : '90%'}
                            </p>
                          </span>
                        </div>

                        {/* Add other properties as needed */}
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Join
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// player2 String @db.Text
// player2Address String @db.Text
// player2Image String @db.Text

// deck2 String
// deck2Name String
// deck2Image String @db.Text

// url String @db.Text

// type GameType @default(ONE)

// check1 Boolean
// check2 Boolean

// status GameStatus @default(READY)
