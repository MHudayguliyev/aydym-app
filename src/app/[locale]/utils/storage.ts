import { isUndefined } from "./helpers"

export function getFromSession(key:string) {    
    return sessionStorage.getItem(key)!
}
export function setToSession(key: string, value: string) {  
    return sessionStorage.setItem(key, value)
}
export function removeFromSession(key: string){
    return sessionStorage.removeItem(key);
}
export function getFromStorage(key:string){
    const data = localStorage.getItem(key)
    if(key === 'auth' && !isUndefined(data)){
        const parsed = JSON.parse(data!)
        return parsed
    }
    return data
}
export function setToStorage<T extends string>(key: T, value: T) {
    return localStorage.setItem(key, value)
}
export function removeFromStorage(key: string) {
    return localStorage.removeItem(key)
}