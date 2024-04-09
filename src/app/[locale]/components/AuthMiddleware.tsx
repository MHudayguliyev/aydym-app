import { useRouter, usePathname } from "next/navigation"
import authToken from "@api/service/auth_token"

function AuthMiddleware (WrappedComponent:any){
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const pathname = usePathname()
    const token = authToken()

    // console.log('pathname', pathname)

    if(!token){
      localStorage.setItem('path', pathname)
      router?.push('/register')
      return null
    } 
    return <WrappedComponent {...props}/>
  }
}

export default AuthMiddleware