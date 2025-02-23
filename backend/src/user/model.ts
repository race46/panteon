export interface User {
    id: number;
    name: string;
    username: string;
    lastname: string;
    email: string;
    country: string | null;
}


export interface UserPrize {
    userId: number,
    prize: number,
}
