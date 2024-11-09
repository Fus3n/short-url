import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const BASE_URL = "https://short-url-web.vercel.app";

import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type User = {
  id: number
  name: string | null
  email: string
  createdAt: string
}

export async function getMe(): Promise<User | null> {
  try {
    const resp = await axios.get("/api/auth/me");
    if (resp.status === 200) {
      const user = resp.data.user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export const deleteURL = async (id: string) => {
  const resp = await axios.delete(`/api/url/delete/${id}`);
  return resp; 
};

export async function logout() {
  const resp = await axios.post("/api/auth/logout");
  if (resp.status === 200) {
    return true;
  }
  return false;
}

// export async function 

const GTA_QUOTES = [
  {
    "text": "You Forget A Thousand Things Every Day, Pal. Make Sure This Is One Of 'Em.",
    "author": "Michael de Santa"
  },
  {
    "text": "Don't You Ever Not Tell Me Things I Wanna Know!",
    "author": "Trevor Philips"
  },
  {
    "text": "If That's Our Standard For Goodness... Then No Wonder This Country's Screwed.",
    "author": "Michael de Santa"
  },
  {
    "text": "It's Either This Or Dealing Dimebags. The Bullets Come Crackin' At Yo Ass Either Way.",
    "author": "Franklin Clinton"
  },
  {
    "text": "I'm Cranked Out On Speed Most Of The Time, But I Am Productivity Personified.",
    "author": "Trevor Philips"
  },
  {
    "text": "Go To College. Then You Can Rip People Off and Get Paid For It. It's Called Capitalism.",
    "author": "Michael de Santa"
  },
  {
    "text": "Scooooter Brother!",
    "author": "Trevor Philips"
  },
  {
    "text": "Surviving Is Winning, Franklin! Everything Else Is Bulls***! Fairytales Spun By People Afraid To Look Life In The Eye! Whatever It Takes, Kid! Survive!",
    "author": "Michael de Santa"
  },
  {
    "text": "What Kinda F****** Animal Do You Take Me For? No, I Didn't Kill Him! But I Did Kidnap His Wife.",
    "author": "Trevor Philips"
  },
  {
    "text": "I'll Swing By And Sign The Contracts, Alright? Just Ignore The Bodies!",
    "author": "Trevor Philips"
  },
  {
    "text": "Look, You Wake Up One Day And Your Legs, They Just Give, And You Just Can't Run Anymore.",
    "author": "Michael de Santa"
  },
  {
    "text": "I Said Something Nice, Not Expensive.",
    "author": "Trevor Philips"
  },
]

export function getRandomQuote() {
  return GTA_QUOTES[Math.floor(Math.random() * GTA_QUOTES.length)];
}