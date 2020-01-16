import { Page } from './page';
import { Dropdown } from './dropdown';

export interface Section {
	title: string;
	children: (Page | Dropdown)[];
	rol: number[]
}
