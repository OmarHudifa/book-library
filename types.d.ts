interface Book{
    id:string,
    title:string,
    author:string,
    genre:string,
    rating:string,
    total_copies:string,
    available_copies:string,
    description:string,
    cover:string,
    color:string,
    summary:string,
    isLoanedBook?:boolean
}

interface AuthCredentials{
    fullName:string,
    email:string,
    password:string,
    universityId:number,
    universityCard:string
}
