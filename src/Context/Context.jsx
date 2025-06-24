// Global API base URL context for the app
import React, { createContext } from 'react';

export const ApiBaseUrl = createContext('https://stdent-reg-bk.onrender.com');

// Usage example in your components:
// import { useContext } from 'react';
// import { ApiBaseUrl } from '../Context/Context';
// const apiUrl = useContext(ApiBaseUrl);
