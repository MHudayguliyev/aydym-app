export interface ConfirmReturnType {
    username: string  
    access_token:string 
    profileType: 'STANDARD' | 'PREMIUM'
    token_type: 'Bearer'
    status: boolean
}