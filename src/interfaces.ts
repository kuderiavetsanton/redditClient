export interface Author{
    _id:string,
    username:string,
    email?:string,
    posts?:Post[] | string[],
    subs?:Sub[] | string[]
}
export interface Sub{
    name:string,
    author:Author,
    title:string,
    description?:string,
    posts?:Post[] | string[],
    imageUrn?:string,
    bannerUrn?:string,
    imageUrl?:string,
    bannerUrl?:string,
    createdAt?:Date,
    updatedAt?:Date
}
export interface Comment{
    username:string,
    body:string,
    post?:Post | string,
    votes?:Vote[] | string[],
    voteScore:number,
    userVote?:number
}
export interface Post{
    _id:string,
    slug:string,
    author:Author,
    title:string,
    body?:string,
    sub?:Sub,
    comments?:Comment[] | string[]
    url:string,
    votes:Vote[] | string[]
    voteScore:number,
    commentsAmount?:number,
    userVote?:number,
    createdAt:Date
}
export interface Vote{
    username:string,
    value:number,
    post?:Post,
    comment?:Comment
}