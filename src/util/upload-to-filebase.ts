import { FilebaseClient } from '@filebase/client';

const filebaseClient = new FilebaseClient({
  token: process.env.FILEBASE_TOKEN || '',
});

export const uploadToFilebase = async (mediaFile: File | null) => {
  const mediaFileCid = mediaFile ? await filebaseClient.storeBlob(mediaFile) : undefined;
  //TODO: Do we want to save the raw ipfs uri or prepend with ipfs gateway?
  const mediaUri = mediaFileCid ? `ipfs://${mediaFileCid}` : undefined;

  return mediaUri;
};

export const fetchImageAndUploadToFilebase = async (imageUrl: string) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  const fileName = imageUrl.split('/').pop();
  const file = new File([blob], fileName || imageUrl, { type: blob.type });

  return uploadToFilebase(file);
};
