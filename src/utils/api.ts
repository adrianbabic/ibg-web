import { LoginData, RegisterData } from "./external";

const HOST = 'http://localhost:8080';

export const registerUser = async (data: RegisterData) => {
    const response = await fetch(`${HOST}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData;
    } else if (response.status === 403) {
        throw new Error('Korisničko ime ili email su već zauzeti');
    } else {
        throw new Error('Dogodila se greška na serveru');
    }
};


export const loginUser = async (data: LoginData) => {
    const response = await fetch(`${HOST}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData;
    } else if (response.status === 500) {
        throw new Error('Pogrešno korisničko ime ili lozinka');
    } else {
        throw new Error('Dogodila se greška na serveru');
    }
};
