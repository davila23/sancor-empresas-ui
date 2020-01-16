import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { UtilService, AuthService } from '@app/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

	constructor(
		private dashboardService: DashboardService,
		private utilService: UtilService,
		private authService: AuthService,
		private router: Router
	) { }

	user = JSON.parse(localStorage.getItem('user')); 
	pagina = '';
	isSnavOpened = false;

  dialogRef = null;

	sViewport = window.innerWidth <= 768;

	ngOnInit() {
		this.dashboardService.onSidenavToggle.subscribe(() => {
			this.isSnavOpened = this.dashboardService.isSnavOpened;
		});
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.setPage(event.urlAfterRedirects);
			}
		});
		this.setPage(this.router.url);
	}

	setPage(url) {
		let s = url;
		if ((s.match(/\//g) || []).length > 2) {
			for (let i = 2; i <= s.match(/\//g).length; i++) {
				s = s.substring(0, s.lastIndexOf('/'));
			}
		}
		this.pagina = s.substring(s.lastIndexOf('/') + 1, s.length);
	}

	toggleSidenav() {
		this.dashboardService.onSidenavToggle.emit();
	}

	logout() {
    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Diálogo de confirmación',
				texto: '¿Desea cerrar la sesión?',
				confirmar: 'Cerrar sesión',
				cancelar: 'Cancelar'
      });
      
			this.dialogRef.afterClosed().toPromise().then((respuesta) => {
				if (respuesta) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }

				this.dialogRef = null;
			});
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.sViewport = event.target.innerWidth <= 600;
	}
}
