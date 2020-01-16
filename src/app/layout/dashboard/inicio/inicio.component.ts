import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from '@env';
import { Chart } from 'chart.js';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements AfterViewInit {

	constructor(
	) { }

	doughnutChartData = {
		type: 'doughnut',
		data: {
			labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'Street Sales'],
			datasets: [
				{
					label: 'dataset',
					data: [350, 450, 100],
					backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(255, 165, 0)']
				}
			]
		},
		options: {
			legend: {
				display: false
			},
			responsive: false
		}
	};

	barChartData = {
		type: 'bar',
		data: {
			labels: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
			datasets: [
				{
					label: 'dataset',
					data: [350, 450, 100, 0, 225, 150, 800],
					backgroundColor: environment.colors.accent
				}
			]
		},
		options: {
			legend: {
				display: false
			},
			responsive: true
		}
	};

	chart1 = null;
	chart2 = null;
	chart3 = null;
	chart4 = null;
	chart5 = null;

	title = 'My first AGM project';
	lat = -34.6281749;
	lng = -58.5658301;

	@ViewChild('canva1') canva1: ElementRef;
	@ViewChild('canva2') canva2: ElementRef;
	@ViewChild('canva3') canva3: ElementRef;
	@ViewChild('canva4') canva4: ElementRef;
	@ViewChild('canva5') canva5: ElementRef;

	ngAfterViewInit() {
		setTimeout(() => {
			this.chart1 = new Chart(this.canva1.nativeElement.getContext('2d'), this.barChartData);
			this.chart2 = new Chart(this.canva2.nativeElement.getContext('2d'), this.randomizeData(this.doughnutChartData));
			this.chart3 = new Chart(this.canva3.nativeElement.getContext('2d'), this.randomizeData(this.doughnutChartData));
			this.chart4 = new Chart(this.canva4.nativeElement.getContext('2d'), this.randomizeData(this.doughnutChartData));
			this.chart5 = new Chart(this.canva5.nativeElement.getContext('2d'), this.randomizeData(this.doughnutChartData));
		});
	}

	randomizeData(chart) {
		chart.data.datasets[0].data = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
		return chart;
	}

}
