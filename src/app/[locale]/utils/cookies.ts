'use server';
import { cookies } from 'next/headers'

export const getCookies = (name: string) => {
    const cookieStore = cookies()
    return cookieStore.get(name)
 }