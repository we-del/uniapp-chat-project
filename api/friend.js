import request from '@/common/util/request.js'
export const sendFriendApply = data => request.post('/apply',data)

export const handleFriendApply = data => request.post('/hanldeApply',data)

export const getFriendApplyList = (pageIndex=1) => request.get(`/applyList/${pageIndex}`)

