'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ImageIcon, Check } from 'lucide-react';
import { z } from 'zod';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { createListing } from '@/lib/services/listings';

const listingSchema = z.object({
  crop_type: z.string().min(1, 'Select a crop type'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price_ac: z.number().min(1, 'Price must be at least 1 AC'),
});

const CROP_OPTIONS = ['Wheat', 'Rice', 'Mustard', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Groundnut'];

export default function CreatePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priceAc, setPriceAc] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    setSuccess(false);

    const parsed = listingSchema.safeParse({
      crop_type: cropType,
      quantity: Number(quantity),
      price_ac: Number(priceAc),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach(e => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!DEMO_MODE && !image) {
      setErrors({ image: 'Image is required' });
      return;
    }

    if (!profile) return;
    setLoading(true);

    try {
      if (DEMO_MODE) {
        getDemoStore().createListing({
          seller_uid: profile.uid,
          seller_phone: profile.phone,
          crop_type: cropType,
          quantity: Number(quantity),
          price_ac: Number(priceAc),
          image_url: imagePreview || '',
          village: profile.village,
        });
      } else {
        await createListing({
          seller_uid: profile.uid,
          seller_phone: profile.phone,
          crop_type: cropType,
          quantity: Number(quantity),
          price_ac: Number(priceAc),
          village: profile.village,
          image: image!,
        });
      }

      setSuccess(true);
      setTimeout(() => router.push('/listings'), 1500);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to create listing' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto space-y-5">
        <h1 className="text-lg font-bold text-neutral-800">Create Listing</h1>

        {success ? (
          <div className="bg-green-50 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Check size={24} className="text-green-600" />
            </div>
            <p className="text-sm font-semibold text-green-700">Listing Created!</p>
            <p className="text-xs text-green-500 mt-1">
              Credits will be created only after trade completion. No inflation.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-4 border border-neutral-100">
            {/* Crop Type */}
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-2 block">Crop Type</label>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map(crop => (
                  <button
                    key={crop}
                    onClick={() => setCropType(crop)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                      cropType === crop
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
              {errors.crop_type && (
                <p className="text-xs text-red-500 mt-1">{errors.crop_type}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                Quantity (quintals)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                min={1}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                Price per quintal (AC)
              </label>
              <input
                type="number"
                value={priceAc}
                onChange={e => setPriceAc(e.target.value)}
                placeholder="e.g. 2200"
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                min={1}
              />
              {errors.price_ac && (
                <p className="text-xs text-red-500 mt-1">{errors.price_ac}</p>
              )}
              <p className="text-[10px] text-neutral-400 mt-1">
                1 AC = ₹1 MSP equivalent value
              </p>
            </div>

            {/* Village auto-fill */}
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Village</label>
              <input
                type="text"
                value={profile?.village || ''}
                disabled
                className="w-full border border-neutral-100 bg-neutral-50 rounded-xl px-3 py-2.5 text-sm text-neutral-400"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                Crop Image {!DEMO_MODE && '*'}
              </label>
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <ImageIcon size={24} className="text-neutral-300" />
                    <span className="text-xs text-neutral-400">Tap to upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">{errors.image}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors.submit}</p>
            )}

            <div className="bg-neutral-50 rounded-xl p-3 text-xs text-neutral-500">
              <p className="font-medium text-neutral-600 mb-1">Note:</p>
              <p>
                Credits are NOT created on listing. They are only generated when a verified trade is
                completed through escrow — preventing inflation.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={16} />
                  Create Listing
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
