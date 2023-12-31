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

// TODO: 사진 붙히기

interface CardInputProps {
  apiUrl: string;
  query: Record<string, any>;
  member: Member;
  type: any;
  cards: any;
  showDeck: any;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const MyCards = ({
  cards,
  apiUrl,
  showDeck,
  query,
  type,
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
      const newValues = { ...values, type: 'player1' };

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

  return (
    <div className='relative flex justify-center w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            disabled={member.role === 'ADMIN'}
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
                              member.role === 'ADMIN' ||
                              !possibleCards.includes(card)
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
                              src={`/testImage/test.png`}
                              width={80}
                              height={80}
                              alt='opponent cards'
                              className={cn(
                                !possibleCards.includes(card)
                                  ? 'brightness-50'
                                  : 'brightness-100',
                                'absolute inset-0 left-6 top-11 rounded-md'
                              )}
                            />
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <FormField
                      disabled={member.role === 'ADMIN' || possibleCards.length === 0 || isLoading}
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
                      disabled={member.role === 'ADMIN' || isLoading}
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

export default MyCards;
