import axios from 'axios';

export const baseURL = "http://192.168.1.2:3333"

const backend = axios.create({
    baseURL
})

export function appendToBackendBaseURL(path: string) {
    return `${baseURL}${path}`
}

export default backend