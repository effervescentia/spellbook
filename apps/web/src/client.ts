import type { App } from '@spellbook/api';
import { treaty } from '@elysiajs/eden';

export const client = treaty<App>('localhost:3000');
