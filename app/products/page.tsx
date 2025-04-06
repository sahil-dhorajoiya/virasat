'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter } from 'lucide-react';
import { IProduct } from '@/lib/models/product';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    'Blazer',
    'Jodhpuri',
    'Indo Western',
    'Sherwani',
    'Kurta Pajama',
    'Mojdi',
    'Accessories',
  ];

  const fetchProducts = async () => {
    try {
      let url = '/api/products?';
      if (searchQuery) url += `search=${searchQuery}&`;
      if (selectedCategory) url += `category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData: FormData) => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Error',
          description: 'Please upload a product image',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          productCode: formData.get('productCode'),
          category: formData.get('category'),
          size: formData.get('size'),
          availableStock: Number(formData.get('availableStock')),
          rentPrice: Number(formData.get('rentPrice')),
          salePrice: Number(formData.get('salePrice')),
          deposit: Number(formData.get('deposit')),
          damagePolicy: formData.get('damagePolicy'),
          imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      toast({
        title: 'Success',
        description: 'Product added successfully',
      });

      setIsAddDialogOpen(false);
      setImageUrl('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t('common.navigation.products')}
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('common.actions.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {t('common.actions.add')} {t('common.product.name')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddProduct(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t('common.product.name')}</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productCode">
                      {t('common.product.code')}
                    </Label>
                    <Input id="productCode" name="productCode" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">
                      {t('common.product.category')}
                    </Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`common.product.categories.${category.toLowerCase().replace(' ', '')}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="size">{t('common.product.size')}</Label>
                    <Input id="size" name="size" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="availableStock">
                      {t('common.product.stock')}
                    </Label>
                    <Input
                      id="availableStock"
                      name="availableStock"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rentPrice">
                      {t('common.product.rentPrice')}
                    </Label>
                    <Input
                      id="rentPrice"
                      name="rentPrice"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salePrice">
                      {t('common.product.salePrice')}
                    </Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deposit">
                      {t('common.product.deposit')}
                    </Label>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="damagePolicy">
                      {t('common.product.damagePolicy')}
                    </Label>
                    <Input id="damagePolicy" name="damagePolicy" required />
                  </div>
                  <ImageUpload
                    value={imageUrl}
                    onChange={setImageUrl}
                    onRemove={() => setImageUrl('')}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setImageUrl('');
                  }}
                >
                  {t('common.actions.cancel')}
                </Button>
                <Button type="submit">
                  {t('common.actions.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.actions.filter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">{t('common.actions.search')}</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.product.name')}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fetchProducts()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="category">
                {t('common.product.category')}
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  fetchProducts();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`common.product.categories.${category.toLowerCase().replace(' ', '')}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>{t('common.product.name')}</TableHead>
                <TableHead>{t('common.product.code')}</TableHead>
                <TableHead>{t('common.product.category')}</TableHead>
                <TableHead>{t('common.product.size')}</TableHead>
                <TableHead>{t('common.product.stock')}</TableHead>
                <TableHead>{t('common.product.rentPrice')}</TableHead>
                <TableHead>{t('common.product.salePrice')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow >
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>
                      {t(`common.product.categories.${product.category.toLowerCase().replace(' ', '')}`)}
                    </TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.availableStock}</TableCell>
                    <TableCell>₹{product.rentPrice}</TableCell>
                    <TableCell>₹{product.salePrice}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle edit
                        }}
                      >
                        {t('common.actions.edit')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 