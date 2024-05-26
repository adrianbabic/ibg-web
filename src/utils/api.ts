import { HOST } from "@/constants";
import { CreateEventInfo, LoginData, RegisterData } from "./external";
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
    } else if (response.status === 400) {
        const responseData = await response.json();
        throw new Error(responseData.body);
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

export const fetchLocations = async () => {
    try {
        const response = await fetch(`${HOST}/location/public`);
        if (!response.ok) {
            throw new Error('Pogreska pri dohvacanju lokacija');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju lokacija:', error);
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
            throw new Error('Odgovor servera nije bio 200 OK za dohvat mojih dogadaja');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju mojih dogadaja:', error);
        throw error;
    }
};

export const fetchFilteredEvents = async (myGames: boolean, sportId: string, locationId: string) => {
    try {
        const token = Cookies.get('token');

        const tokenValidation = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

        if (tokenValidation.status !== 200) {
            const loginUrl = new URL('/login', HOST);
            return NextResponse.redirect(loginUrl);
        }

        const response = await fetch(`${HOST}/event/filter?myGames=${myGames}&location=${locationId}&sport=${sportId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Odgovor servera nije bio 200 OK za dohvat filtriranih mojih dogadaja');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju filtriranih mojih dogadaja:', error);
        throw error;
    }
};

export const createEvent = async (createEventInfo: CreateEventInfo) => {
    try {
        const token = Cookies.get('token');

        const tokenValidation = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

        if (tokenValidation.status !== 200) {
            const loginUrl = new URL('/login', HOST);
            return NextResponse.redirect(loginUrl);
        }

        const response = await fetch(`${HOST}/event/createEvent`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(createEventInfo),
        });

        if (!response.ok) {
            throw new Error("Nije moguće spremiti događaj, pokušajte ponovno");
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchEventById = async (eventId: string) => {
    try {
        const token = Cookies.get('token');

        const tokenValidation = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

        if (tokenValidation.status !== 200) {
            const loginUrl = new URL('/login', HOST);
            return NextResponse.redirect(loginUrl);
        }

        const response = await fetch(`${HOST}/event/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Odgovor servera nije bio 200 OK za dohvat dogadaja pomocu id-ja');
        }
        return await response.json();
    } catch (error) {
        console.error('Pogreska pri dohvacanju dogadaja pomocu id-ja:', error);
        throw error;
    }
};