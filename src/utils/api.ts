import { HOST } from "@/constants";
import { LoginData, RegisterData } from "./external";
import Cookies from "js-cookie";
import { NextResponse } from "next/server";


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

export const fetchSports = async () => {
    try {
        const response = await fetch(`${HOST}/sport/public`);
        if (!response.ok) {
            throw new Error('Pogreska pri dohvacanju sportova');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju sportova:', error);
        throw error;
    }
};

export const fetchLiveEvents = async () => {
    try {
        const token = Cookies.get('token');

        const tokenValidation = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

        if (tokenValidation.status !== 200) {
            const loginUrl = new URL('/login', HOST);
            return NextResponse.redirect(loginUrl);
        }

        const response = await fetch(`${HOST}/event/filter?myGames=False`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Odgovor servera nije bio 200 OK za dohvat aktivnih dogadaja');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju aktivnih dogadaka:', error);
        throw error;
    }
};


export const fetchMyEvents = async () => {
    try {
        const token = Cookies.get('token');

        const tokenValidation = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

        if (tokenValidation.status !== 200) {
            const loginUrl = new URL('/login', HOST);
            return NextResponse.redirect(loginUrl);
        }

        const response = await fetch(`${HOST}/event/filter?myGames=True`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Odgovor servera nije bio 200 OK za dohvat aktivnih dogadaja');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju aktivnih dogadaka:', error);
        throw error;
    }
};