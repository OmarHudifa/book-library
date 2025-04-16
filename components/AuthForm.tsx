"use client"

import React from 'react'
import { DefaultValues, FieldValue, FieldValues, Path, SubmitHandler } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm,UseFormReturn } from "react-hook-form"
import {object, z, ZodType} from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from '@/constants'
import ImageUpload from './ImageUpload'
import { toast } from 'sonner'
import { useRouter } from "next/navigation";



interface Props<T extends FieldValues>{
    schema :ZodType<T>,
    defaultValues:T,
    onSubmit:(data:T)=>Promise<{success:boolean,error?:string}>,
    type:"SIGN_IN"|"SIGN_UP"
}

const AuthForm=<T extends FieldValues>({type,schema,defaultValues,onSubmit}:Props<T>) => {
    const router=useRouter()
    const isSignIn=type==='SIGN_IN'
    const form: UseFormReturn<T>=useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
      })
     
      
      const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);
          console.log("hello this is 1")
        if(result.success){
          toast("Success",{
            description: isSignIn? `you have successfully signed in.`:`you have successfully signed up.`
            })
            console.log("2")
            router.push("/")
        }else{
          toast(`Error ${isSignIn?"signing in":"signing up"}`,{
            description: result.error?? "An error occurred."
            })
        }
        
      }


  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold text-white'>{isSignIn?"Welcome Back to BookWise":"Create your library account"}</h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {Object.keys(defaultValues).map((field)=>(
        <FormField
        key={field}
        control={form.control}
        name={field as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
            <FormControl >
              {field.name === "universityCard"?<ImageUpload onFileChange={field.onChange}/>
              :<Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} className='form-input' />}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      ))}
      
      <Button className="form-btn" type="submit">{isSignIn?"Sign In":"Sign Up"}</Button>
    </form>
  </Form>
  <p className='text-base text-center font-medium'>
    {isSignIn?"New to BookWise? ":"Already have an account? "}
    <Link className="font-bold text-primary" href={isSignIn?"/sign-up":"/sign-in"}>{isSignIn?"Create an account":"Sign In"}</Link>
  </p>
  </div>
  )
}

export default AuthForm