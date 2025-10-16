import { supabase } from "../supabase";
import imageCompression from "browser-image-compression";

export async function uploadImageToSupabase(
  file: File,
  nomeLoja: string,
  medidorId: string
): Promise<string> {
  const bucketName = "leitura-fotos";
  const folderPath = `${nomeLoja}/${medidorId}`;
  const fileName = `${Date.now()}-${file.name}`;
  const fullPath = `${folderPath}/${fileName}`;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  let fileToUpload: File;

  try {
    const compressedBlob = await imageCompression(file, options);
    fileToUpload = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
    });
  } catch (error) {
    console.warn("Compressão falhou, usando arquivo original:", error);
    fileToUpload = file; // fallback
  }

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fullPath, fileToUpload, {
      contentType: fileToUpload.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Erro no upload para Supabase Storage:", uploadError);
    throw new Error("Erro no upload da imagem: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fullPath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Não foi possível obter a URL pública da imagem.");
  }

  return publicUrlData.publicUrl;
}
