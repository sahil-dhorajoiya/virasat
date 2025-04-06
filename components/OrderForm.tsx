'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { IProduct } from '@/lib/models/product';

interface OrderFormProps {
  onSubmit: (data: any) => void;
  type: 'rental' | 'sale';
  isPublic?: boolean;
}

export default function OrderForm({
  onSubmit,
  type,
  isPublic = false,
}: OrderFormProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    rentalDuration?: {
      startDate: Date;
      endDate: Date;
    };
  }>>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, discountType, discountValue, deposit]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?available=true');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const calculateTotals = () => {
    const newSubtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);

    let discount = 0;
    if (discountType === 'percentage') {
      discount = (newSubtotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }

    setTotal(newSubtotal - discount + deposit);
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product._id,
        quantity: 1,
        price: type === 'rental' ? product.rentPrice : product.salePrice,
        name: product.name,
        ...(type === 'rental' && {
          rentalDuration: {
            startDate: new Date(),
            endDate: new Date(),
          },
        }),
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = quantity;
    setSelectedProducts(newSelectedProducts);
  };

  const handleDateChange = (
    index: number,
    field: 'startDate' | 'endDate',
    date: Date
  ) => {
    const newSelectedProducts = [...selectedProducts];
    if (!newSelectedProducts[index].rentalDuration) {
      newSelectedProducts[index].rentalDuration = {
        startDate: new Date(),
        endDate: new Date(),
      };
    }
    newSelectedProducts[index].rentalDuration![field] = date;
    setSelectedProducts(newSelectedProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName,
      customerPhone,
      customerAddress,
      items: selectedProducts,
      orderType: type,
      subtotal,
      discount: discountValue > 0 ? { type: discountType, value: discountValue } : undefined,
      deposit,
      total,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">
            {t('common.customer.name')}
          </Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">
            {t('common.customer.phone')}
          </Label>
          <Input
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="customerAddress">
            {t('common.customer.address')}
          </Label>
          <Input
            id="customerAddress"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Product Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="product">
            {t('common.product.name')}
          </Label>
          <Select onValueChange={handleAddProduct}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name} - ₹
                  {type === 'rental'
                    ? product.rentPrice
                    : product.salePrice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProducts.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                {type === 'rental' && (
                  <>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                  </>
                )}
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      className="w-20"
                    />
                  </TableCell>
                  {type === 'rental' && (
                    <>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[180px] justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {item.rentalDuration?.startDate ? (
                                format(item.rentalDuration.startDate, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.rentalDuration?.startDate}
                              onSelect={(date) =>
                                date && handleDateChange(index, 'startDate', date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[180px] justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {item.rentalDuration?.endDate ? (
                                format(item.rentalDuration.endDate, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.rentalDuration?.endDate}
                              onSelect={(date) =>
                                date && handleDateChange(index, 'endDate', date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </>
                  )}
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>₹{item.price * item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Order Summary */}
      {selectedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-end space-x-4">
            <div className="w-[200px] space-y-2">
              <Label>Subtotal</Label>
              <Input value={`₹${subtotal}`} readOnly />
            </div>
          </div>

          {!isPublic && (
            <div className="flex justify-end space-x-4">
              <div className="w-[200px] space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountType}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setDiscountType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px] space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {type === 'rental' && (
            <div className="flex justify-end space-x-4">
              <div className="w-[200px] space-y-2">
                <Label>Deposit</Label>
                <Input
                  type="number"
                  min="0"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <div className="w-[200px] space-y-2">
              <Label>Total</Label>
              <Input value={`₹${total}`} readOnly />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={selectedProducts.length === 0}>
          {isPublic ? 'Submit Booking Request' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
} 