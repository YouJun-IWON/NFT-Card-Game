'use client';


import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

import { ethers } from 'ethers';
import { abi } from '@/constants/abi';

const formSchema = z.object({
  name: z.string(),
});

// TODO: 하나만 생성할 수 있게 해야한다. 내 ID가 있는 room의 status가 READY 나 RUN이면 만들지 못하게 한다.
export const CheckReceipt = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { result, profile } = data;

  const isModalOpen = isOpen && type === 'checkReciept';

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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

    await contractWithSigner.end_game(result?.contract, profile?.address);
    const finalValue = result?.id;

    try {
      await axios.post('/api/final', finalValue);

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
            Check your Prize
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6 flex items-center justify-center'>
              <span className='text-center text-2xl'>🎉 1 Klay 🎉</span>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' type='submit' disabled={isLoading}>
                Receive
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
