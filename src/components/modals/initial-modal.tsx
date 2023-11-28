'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { dummyCards } from '@/constants/dummyData';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  imageUrl: z.string().min(1, { message: 'Server image is required.' }),
  collection: z.string().min(1, { message: 'Collection is required.' }),
});

export const InitialModal = ({ deckExisting }: any) => {
  const [isMounted, setIsMounted] = useState(false);

  const [cards, setCards] = useState('');

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      collection: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedCollection = String(values.collection);
      // TODO: 선택한 collection의 카드 정보를 가져온다. 그리고 owner를 채크한다.

      const selectedCollectionData = (dummyCards as Record<string, string[]>)[
        selectedCollection
      ];

      const finalValues = {
        ...values,
        cards: selectedCollectionData.join(','),
        owner: '0x61327612EC4aFD93e370eC0599f933bB08020A54',
      };

      await axios.post('/api/servers', finalValues);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Create First NFT Poker Deck
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Choose a cover photo for your deck. Then select the NFTs that will
            make up your deck.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      NFT Poker Deck name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter Deck name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: check */}
              {deckExisting ? (
                <FormField
                  control={form.control}
                  name='collection'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Collection containing more than 54 NFTs
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                            <SelectValue placeholder='Select Your NFT Collection' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* {Object.values(Collections).map((collection) => (
                          <SelectItem
                            key={collection}
                            value={collection}
                            className='capitalize'
                          >
                            {collection.toLowerCase()}
                          </SelectItem>
                        ))} */}
                          <SelectItem value='burmy' className='capitalize'>
                            burmy
                          </SelectItem>
                          <SelectItem value='suri' className='capitalize'>
                            suri
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name='collection'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Choose the deck you want to rent
                      (Winning commission is 20%)
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                            <SelectValue placeholder='Select Your NFT Collection' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* {Object.values(Collections).map((collection) => (
                        <SelectItem
                          key={collection}
                          value={collection}
                          className='capitalize'
                        >
                          {collection.toLowerCase()}
                        </SelectItem>
                      ))} */}
                          <SelectItem value='burmy' className='capitalize'>
                            burmylent
                          </SelectItem>
                          <SelectItem value='suri' className='capitalize'>
                            surilent
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant='primary'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
