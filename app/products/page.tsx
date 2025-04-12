'use client';

import { useEffect, useState } from 'react';
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
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import { IProduct } from '@/lib/models/product';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

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

  const handleEditProduct = async (formData: FormData) => {
    try {
      if (!selectedProduct || !selectedProduct._id) {
        toast({
          title: 'Error',
          description: 'No product selected for editing',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/products?id=${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          name: formData.get('name'),
          productCode: formData.get('productCode'),
          category: formData.get('category'),
          size: formData.get('size'),
          availableStock: Number(formData.get('availableStock')),
          rentPrice: Number(formData.get('rentPrice')),
          salePrice: Number(formData.get('salePrice')),
          deposit: Number(formData.get('deposit')),
          damagePolicy: formData.get('damagePolicy'),
          imageUrl: imageUrl || selectedProduct.imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });

      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setImageUrl('');
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!productToDelete || !productToDelete._id) {
        toast({
          title: 'Error',
          description: 'No product selected for deletion',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/products?id=${productToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  useEffect(() =>{
    fetchProducts();
  },[])

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <ScrollArea className="h-[calc(100vh-300px)]">
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
                    <TableRow key={product.id}>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setImageUrl(product.imageUrl);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            {t('common.actions.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t('common.actions.edit')} {t('common.product.name')}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditProduct(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">{t('common.product.name')}</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      defaultValue={selectedProduct.name}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-productCode">
                      {t('common.product.code')}
                    </Label>
                    <Input 
                      id="edit-productCode" 
                      name="productCode" 
                      defaultValue={selectedProduct.productCode}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">
                      {t('common.product.category')}
                    </Label>
                    <Select name="category" defaultValue={selectedProduct.category} required>
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
                    <Label htmlFor="edit-size">{t('common.product.size')}</Label>
                    <Input 
                      id="edit-size" 
                      name="size" 
                      defaultValue={selectedProduct.size}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-availableStock">
                      {t('common.product.stock')}
                    </Label>
                    <Input
                      id="edit-availableStock"
                      name="availableStock"
                      type="number"
                      min="0"
                      defaultValue={selectedProduct.availableStock}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-rentPrice">
                      {t('common.product.rentPrice')}
                    </Label>
                    <Input
                      id="edit-rentPrice"
                      name="rentPrice"
                      type="number"
                      min="0"
                      defaultValue={selectedProduct.rentPrice}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-salePrice">
                      {t('common.product.salePrice')}
                    </Label>
                    <Input
                      id="edit-salePrice"
                      name="salePrice"
                      type="number"
                      min="0"
                      defaultValue={selectedProduct.salePrice}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-deposit">
                      {t('common.product.deposit')}
                    </Label>
                    <Input
                      id="edit-deposit"
                      name="deposit"
                      type="number"
                      min="0"
                      defaultValue={selectedProduct.deposit}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-damagePolicy">
                      {t('common.product.damagePolicy')}
                    </Label>
                    <Input 
                      id="edit-damagePolicy" 
                      name="damagePolicy" 
                      defaultValue={selectedProduct.damagePolicy}
                      required 
                    />
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
                    setIsEditDialogOpen(false);
                    setSelectedProduct(null);
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
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setProductToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 