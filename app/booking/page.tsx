'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import OrderForm from '@/components/OrderForm';
import { useToast } from '@/hooks/use-toast';

export default function BookingPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [orderType, setOrderType] = useState<'rental' | 'sale'>('rental');

  const handleSubmitBooking = async (orderData: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          status: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      toast({
        title: 'Success',
        description: 'Your booking request has been submitted successfully. We will contact you shortly.',
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit booking request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {t('common.booking.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('common.booking.description')}
          </p>
        </div>

        <div className="mb-6">
          <Label>What would you like to do?</Label>
          <Select
            value={orderType}
            onValueChange={(value: 'rental' | 'sale') => setOrderType(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rental">Rent Products</SelectItem>
              <SelectItem value="sale">Purchase Products</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrderForm
          type={orderType}
          onSubmit={handleSubmitBooking}
          isPublic
        />
      </Card>
    </div>
  );
} 