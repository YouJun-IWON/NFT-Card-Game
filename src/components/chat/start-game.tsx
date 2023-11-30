'use client';
import { Member } from '@prisma/client';
import { ChatInput } from './chat-input';
import axios from 'axios';
import { useState } from 'react';

import * as z from 'zod';

import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '@/components/emoji-picker';
import { Button } from '../ui/button';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatQuery } from '@/hooks/use-chat-query';

interface ChatMessagesProps {
  member: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const StartGame = ({
  member,

  socketUrl,
  socketQuery,
}: ChatMessagesProps) => {
  console.log('member', member.role);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: 'g',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const query = socketQuery;
      const newValues = { ...values, type: 'player1' };

      console.log('newValues', newValues);
      const url = qs.stringifyUrl({
        url: socketUrl,
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
    <div className='flex items-center justify-center h-full'>
      {member.role === 'GUEST' ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'
                      {...field}
                    >
                      <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease'></span>
                      <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease'></span>
                      <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease'></span>
                      <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease'></span>
                      <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100'></span>
                      <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                        Game Start!
                      </span>
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <span>Your opponent is preparing a game...</span>
      )}

      {/* <ChatInput
        profileAddress={profileAddress}
        name={name}
        type={type}
        apiUrl={socketUrl}
        query={socketQuery}
      /> */}
    </div>
  );
};

export default StartGame;
