import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  prevPath?: string | null;
  storage: 'pet-images' | 'activity-images';
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, storage, prevPath, ...imageProps }: RemoteImageProps) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setPhotoUri(null);
      return;
    }
    if (!prevPath) {
      setPhotoUri(path);
      return;
    }
    
    if (prevPath !== path){
      setPhotoUri(path);
      return;
    }
    (async () => {
      setPhotoUri('');
      const { data, error } = await supabase.storage
        .from(storage)
        .download(prevPath);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setPhotoUri(fr.result as string);
        };
      }
    })();
  }, [prevPath, path, storage]);

  if (!photoUri) {
    return;
  }

  return <Image source={{ uri: photoUri }} {...imageProps} />;
};

export default RemoteImage;