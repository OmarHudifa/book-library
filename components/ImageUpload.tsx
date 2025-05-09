"use client"
import React, { useRef,useState } from 'react'
import { IKImage,  ImageKitProvider, IKUpload } from "imagekitio-next";
import config from '@/lib/config';
import Image from 'next/image';
import uploadImage from "../app/icons/upload.svg"
import { toast } from 'sonner';

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};


const ImageUpload = ({onFileChange}:{onFileChange:(filepath:string)=>void}) => {
  const ikUploadRef=useRef(null)
  const [file, setFile] = useState<{filePath:string}|null>(null)


  const onError=(error:any)=>{
    console.log(error)
    toast("Image upload failed",{
      description: `your image could not be uploaded successfully. Please try again.`
      })
  }

  const onSuccess=(res:any)=>{
    setFile(res)
    onFileChange(res.filePath)
    toast("Image upload successfully",{
    description: `${res.filePath} uploaded successfully`,
    })
  }

  return <ImageKitProvider publicKey={config.env.imagekit.publicKey} urlEndpoint={config.env.imagekit.urlEndpoint} authenticator={authenticator}>
    <IKUpload className='hidden' ref={ikUploadRef} onError={onError} onSuccess={onSuccess}
    fileName='test-upload.png'
    />
    <button className='upload-btn' onClick={(e)=>{
      e.preventDefault()
      if(ikUploadRef.current){
       // @ts-ignore
        ikUploadRef.current?.click()
      }
    }}>
      <Image src={uploadImage} width={20} height={20} alt='upload-icon' className='object-contain'/>
      <p className='text-base text-light-100'>Upload a File</p>
      {file && <p className='upload-filename'>{file.filePath}</p>}
    </button>

    {file && <IKImage 
     alt={file.filePath}
     path={file.filePath}
     width={500}
     height={300}
    />}
  </ImageKitProvider>
}

export default ImageUpload


