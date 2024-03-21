import { LightningElement,api,track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/chartJs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PieChartAnalytics extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;
    @api values;
    @api labelSet;

    config = {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: this.values,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)'
                    ],
                    label: 'Dataset 1'
                }
            ],
            labels: this.labelSet
        },
        options: {
            responsive: true,
            legend: {
                position: 'right'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
  
    renderedCallback() {
        console.log('Valuess '+this.values);
      if (this.chartjsInitialized) {
          return;
      }
      this.chartjsInitialized = true;
  
      Promise.all([
          loadScript(this, CHARTJS + '/Chart.min.js'),
          loadStyle(this, CHARTJS + '/Chart.min.css')
      ]).then(() => {
              // disable Chart.js CSS injection
              window.Chart.platform.disableCSSInjection = true;
  
              const canvas = document.createElement('canvas');
              this.template.querySelector('div.chart').appendChild(canvas);
              const ctx = canvas.getContext('2d');
              this.chart = new window.Chart(ctx, this.config);
          })
          .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading charts',
                    message: error.message,
                    variant: 'error'
                })
            );
          });
    }

}