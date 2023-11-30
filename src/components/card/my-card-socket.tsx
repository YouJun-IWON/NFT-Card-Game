'use client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '@/components/emoji-picker';
import { Member } from '@prisma/client';
import { Button } from '../ui/button';
import { judgeTrue } from '@/lib/gameMachine';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { suri } from '@/constants/suri';
import { bummy } from '@/constants/bummy';

// TODO: 사진 붙히기

interface CardInputProps {
  apiUrl: string;
  query: Record<string, any>;
  member: Member;
  type: any;
  cards: any;
  showDeck: any;
  serverId: string;
  deck: any;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const MyCardsSocket = ({
  cards,
  apiUrl,
  showDeck,
  query,
  serverId,
  type,
  deck,
  member,
}: CardInputProps) => {
  const router = useRouter();

  const possibleCards = judgeTrue(showDeck, cards);

  console.log('possible', possibleCards);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  // useEffect(() => {

  //     form.setValue('name', channel.name);
  //     form.setValue('type', channel.type);

  // }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newValues = { ...values, type: 'player1', serverId: serverId };

      console.log(newValues);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, newValues);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  console.log('cardscardscards', deck);

  

  return (
    <div className='relative flex justify-center w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            disabled={type === 'GUEST'}
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='overflow-y-auto p-4 max-h-[300px] flex gap-2 pt-1 flex-wrap'>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-wrap'
                    >
                      {cards.map((card: any, index: any) => (
                        <div key={index}>
                          <RadioGroupItem
                            disabled={
                              type === 'GUEST' || !possibleCards.includes(card)
                            }
                            value={card}
                            id={card}
                            className='peer sr-only'
                          />

                          <Label
                            htmlFor={card}
                            className='relative flex rounded-md border-2 border-muted bg-popover  hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                          >
                            <Image
                              src={`/pokerCardBlack/${card}.png`}
                              width={130}
                              height={130}
                              alt='opponent cards'
                              className={cn(
                                !possibleCards.includes(card)
                                  ? 'brightness-50'
                                  : 'brightness-100'
                              )}
                            />
                            <Image
                              src={
                                deck === 'suri'
                                  ? suri[index + Math.floor(Math.random() * 28)]
                                  : bummy[index + Math.floor(Math.random() * 28)]
                              }
                              width={80}
                              height={80}
                              alt='my card'
                              className={cn(
                                !possibleCards.includes(card)
                                  ? 'brightness-50'
                                  : 'brightness-100',
                                'absolute inset-0 left-6 top-14 rounded-md'
                              )}
                            />
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <FormField
                      disabled={
                        type === 'GUEST' ||
                        possibleCards.length === 0 ||
                        isLoading
                      }
                      control={form.control}
                      name='content'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type='submit'
                              disabled={possibleCards.length === 0 || isLoading}
                              variant='secondary'
                              {...field}
                              className='absolute left-5 -top-16 text-md mt-4 mr-4 bg-sky-600'
                            >
                              Hand Out
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={type === 'GUEST' || isLoading}
                      control={form.control}
                      name='content'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type='submit'
                              onClick={() => form.setValue('content', 'g')}
                              disabled={isLoading}
                              variant='secondary'
                              {...field}
                              className='absolute left-36 -top-16 text-md mt-4 mr-4 bg-rose-500'
                            >
                              Draw
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Badge
                      variant='secondary'
                      className={cn(
                        type === 'GUEST'
                          ? 'absolute left-1/2 transform -translate-x-1/2 min-w-[100px] flex justify-center -top-28 animate-pulse text-lg mt-4'
                          : 'hidden'
                      )}
                    >
                      wait...
                    </Badge>

                    <Badge className='absolute right-0 min-w-[150px] flex justify-center -top-16 text-md mt-4 mr-4'>
                      Cards Count: {cards.length}
                    </Badge>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MyCardsSocket;
