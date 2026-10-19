import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { BackgroundService } from 'src/app/services/background.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private navCtrl: NavController,
    public backgroundProvider: BackgroundService,
    private globalObject : GlobalObjectsService
  ) {}

  ngOnInit() {
  }

  click() {
    this.navCtrl.navigateForward(['home']);
  }

  public start(interval) {
    if (interval) {
      this.globalObject.setDataLocally("interval", interval);
      this.backgroundProvider.start(interval);
    } else {
      this.globalObject.presentAlert("Please enter Interval in secounds");
    }
  }

  public stop() {
    this.backgroundProvider.stop();
  }

}
