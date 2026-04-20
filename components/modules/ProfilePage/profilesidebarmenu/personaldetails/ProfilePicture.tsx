'use client';

import { FC, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfilePictureProps {
  image: string;
  onChange: (imageUrl: string) => void;
}

const ProfilePicture: FC<ProfilePictureProps> = ({ image, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      onChange(newImageUrl);
    }
  };

  return (
    <div className="space-y-2 ">
      <div className="flex justify-start md:justify-center  ">
        <h2 className="w-full text-lg font-semibold text-[var(--secondary-950)] mt-2">
          Profile Picture
        </h2>
      </div>

      <div className="relative w-40 h-48 overflow-hidden bg-muted flex justify-center md:justify-center">
        <img
          src={image || '/placeholder.jpg'}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 w-full bg-black/60 flex justify-center py-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="text-white" />
          </Button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
