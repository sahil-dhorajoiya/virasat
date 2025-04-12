'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
       "product_images"
      );

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dor1ne4ab/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onChange(data.secure_url);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="image">Image</Label>
        {value && onRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {value ? (
        <div className="relative aspect-square w-40 overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="Upload"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WEBP (max. 5MB)
            </p>
          </div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => document.getElementById('image')?.click()}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
      )}
    </div>
  );
} 