import request from '@/common/util/request.js'
export const sendFriendApply = data => request.post('/apply',data)

export const handleFriendApply = data => request.post('/hanldeApply',data)

export const getFriendApplyList = (pageIndex=1) => request.get(`/applyList/${pageIndex}`)

// 得到当前洪湖的好友个数
export const getFriendApplyAcount = () => request.get('/friend/apply/number')

// 得到通讯录的好友
export const getFriendList = ()=> request.get('/friend/list')

// 得到好友的详细信息
export const getFriendDetail = friend_id=> request.get(`/friend/user/deital/${friend_id}`)

