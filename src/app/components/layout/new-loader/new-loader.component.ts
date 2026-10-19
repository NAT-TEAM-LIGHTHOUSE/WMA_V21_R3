import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  standalone: true,
  selector: 'app-new-loader',
  templateUrl: './new-loader.component.html',
  styleUrls: ['./new-loader.component.scss'],
  imports: [STANDALONE_IMPORTS]
})
export class NewLoaderComponent implements OnInit {

  
  steps = [
    { title: 'Uploading', desc: 'Preparing document', icon: '📄', status: 'active' },
    { title: 'Analyzing', desc: 'AI processing', icon: '⚙️', status: 'pending' },
    { title: 'Extracting', desc: 'Reading data', icon: '✨', status: 'pending' },
    { title: 'Validating', desc: 'Quality check', icon: '🗄️', status: 'pending' }
  ];

  statusText = 'Preparing document...';
  current = 0;
  progressWidth = 0;

  ngOnInit(): void {
    setTimeout(() => this.runSteps(), 1000);
  }

  runSteps() {

    // Complete previous
    if (this.current > 0) {
      this.steps[this.current - 1].status = 'completed';
    }

    // Activate current
    if (this.current < this.steps.length) {

      this.steps[this.current].status = 'active';

      this.progressWidth =
        (this.current / (this.steps.length - 1)) * 76;

      this.statusText = this.getStatusText(this.current);

      this.current++;

      setTimeout(() => this.runSteps(), 1500);

    } else {
      this.progressWidth = 76;
      this.statusText = '✔ Extraction complete!';
    }
  }

  getStatusText(index: number): string {
    const messages = [
      'Preparing document...',
      'Analyzing data...',
      'Extracting info...',
      'Validating results...'
    ];
    return messages[index] || '';
  }

}
