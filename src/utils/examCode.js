import { nanoid } from 'nanoid';

export const generateExamCode = () => nanoid(8).toUpperCase();
