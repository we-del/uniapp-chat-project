import request from '@/common/util/request.js'
export const login = data => request.post('/login',data,{token:false})
export const register = data => request.post('/register',data,{token:false})
export const loginout = () => request.post('/loginout')
