export default function authToken() {
    const data = localStorage.getItem("auth") as string
    const obj = JSON.parse(data)
    if (obj && obj.accessToken) {
        return obj.accessToken
    } else {
        return null
    }
}