import axios from 'axios'
import { axiosInstance, BASE_URL } from "../axiosInstance";
import authToken from "./auth_token";

interface CommonTypes {
  url: string 
  config?: {}
  withTotal?: boolean
  changeUrl?: boolean
  homeItems?: boolean
}
interface DataType<T> extends CommonTypes {
  data: T
}

const privateConfig = {
  headers: {
    "Authorization": "", 
    "Content-type": "application/json"
  }, 
}
const GetToken = (): string => {
  if(authToken()){
    const token = 'Bearer ' + authToken()
    return token
  }
  return ""
}

export const api = {
  get: async<T>(props: CommonTypes): Promise<T> => {
    const {
      url, 
      config, 
      withTotal = false, 
      homeItems = false
    } = props

    return axiosInstance.get(url, {...config}).then(response => {
      if(response.data && response.data.data && withTotal)
        return response.data
      else if(response.data && homeItems)
        return response.data.homeItems
      else if(response.data && response.data.data && !withTotal)
        return response.data.data
      return response.data
    })
  },
  getPrivate: async<T>(props: CommonTypes): Promise<T> => {
    const token = GetToken()
    return axiosInstance.get(props.url, {
      ...privateConfig,  headers: {
        ...privateConfig.headers, Authorization: token
      }
    }).then(response => {
      if(response.data && response.data.data)
        return response.data.data
      return response.data
    })
  }, 
  post: async<T,R>(props: DataType<T>): Promise<R> => {
    const {
      url, 
      data, 
      config
    } = props
    return axiosInstance.post(url, {...data}, {...config}).then(response => response.data)
  },
  postPrivate: async<T,R>(props: DataType<T>): Promise<R> => {
    const {
      url, 
      data,
      changeUrl = false, 
    } = props
    const token = GetToken()

    // Deep clone the Axios instance to a new variable
    const clonedAxiosInstance = axios.create(axiosInstance.defaults)
    if(changeUrl)
    clonedAxiosInstance.defaults.baseURL = BASE_URL.replace(/\/v1$/, "").concat('/v2')
    return clonedAxiosInstance.post(url, data, {
      ...privateConfig,  headers: {
        ...privateConfig.headers, Authorization: token
      }
    }).then(response => response.data)
  },
  put: async<T,R>(props: DataType<T>): Promise<R> => {
    const {
      url, 
      data, 
      config
    } = props
    return axiosInstance.put(url, {...data}, {...config}).then(response => response.data)
  },
  putPrivate: async<T,R>(props: DataType<T>): Promise<R> => {
    const {
      url, 
      data, 
      config
    } = props
    const token = GetToken()

    return axiosInstance.put(url, {...data}, {
      ...privateConfig,  headers: {
        ...privateConfig.headers, Authorization: token
      }
    }).then(response => response.data)
  },
  delete: async<T>(props: CommonTypes): Promise<T> => {
    return axiosInstance.delete(props.url, {...props.config}).then(response => response.data)
  },
  deletePrivate: async<T>(props: CommonTypes): Promise<T> => {
    const token = GetToken()
    return axiosInstance.delete(props.url, {
      ...privateConfig,  headers: {
        ...privateConfig.headers, Authorization: token
      }
    }).then(response => response.data)
  }, 
}