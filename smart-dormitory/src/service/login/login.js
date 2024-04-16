import myRequest from "..";

export function accountLoginRequest(account){
    return myRequest.post({
        url:'/login',
        data:account
    })
}
export function postMenuList(id){
    return myRequest.post({
      url: `menu/list/${id}`
    })
  }