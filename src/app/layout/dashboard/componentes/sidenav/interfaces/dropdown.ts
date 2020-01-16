import { Page } from './page';

export interface Dropdown {
	title: string;
	icon: string;
	pages: Page[];
	expanded?: boolean;
}
