import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { collapsible } from '@app/shared';
import { DashboardService } from '../../dashboard.service';
import { MatSidenav } from '@angular/material';
import { Page, Section } from './interfaces';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '@env';
import { SideNavRoutes } from '@app/models/permissions/routes-sections';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	animations: [collapsible]
})
export class SidenavComponent implements OnInit {

	constructor(
		private dashboardService: DashboardService,
		private router: Router
	) { }

	user;
	sViewport = window.innerWidth <= 600;

	sectionsRendered: Section[] = [];

	@ViewChild(MatSidenav) snav: MatSidenav;

	ngOnInit() {

		this.user = JSON.parse(window.localStorage.getItem('user'));

		// if (!environment.production) {
		// 	this.sections.push({
		// 		title: 'Convenios definitivos',
		// 		children: [{ url: '/conveniosdefinitivos', title: 'Listado', icon: 'list' }],
		// 		rol: [1, 21, 69, 70]
		// 	});
		// }

		if (this.user != null && this.user != undefined) {
			for (let i in SideNavRoutes) {
				if (SideNavRoutes[i].rol.length > 0) {
					if (SideNavRoutes[i].rol.find(e => e == this.user.rolId)) {
						this.sectionsRendered.push(SideNavRoutes[i]);
					}
				} else {
					this.sectionsRendered.push(SideNavRoutes[i]);
				}

			}
		}

		if (document.documentElement.clientWidth <= 600) {
			setTimeout(() => {
				this.snav.close();
			});
		}

		this.dashboardService.onSidenavToggle.subscribe((open = null) => {
			if (open === null) {
				this.snav.toggle();
			} else {
				if (open) {
					this.snav.open();
				} else {
					this.snav.close();
				}
			}
		});

		SideNavRoutes.forEach((section: Section) => {
			section.children.forEach((child: any) => {
				if (child.pages) {
					child.pages.forEach((page: Page) => {
						if (window.location.pathname.includes(page.url)) {
							child.expanded = true;
						}
					});
				}
			});
		});

		this.dashboardService.isSnavOpened = this.snav.opened;
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				if (window.innerWidth <= 600 && this.snav.opened) {
					this.snav.close();
				}
			}
		});
	}

	navigate(url) {
		this.router.navigateByUrl(url);
		this.scrollToTop();
	}

	scrollToTop() {
		const c = document.documentElement.scrollTop || document.body.scrollTop;
		if (c > 0) {
			window.requestAnimationFrame(() => {
				this.scrollToTop();
			});
			window.scrollTo(0, c - c / 8);
		}
	}

	isActive(page: Page) {
		return this.router.url === page.url;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (event.target.innerWidth <= 600 && this.snav.opened) {
			this.snav.close();
		}
		this.sViewport = event.target.innerWidth <= 600;
	}

}
