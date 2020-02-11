import { Component, OnInit, HostListener } from '@angular/core';
import { ElectronService } from './service/electron.service';
import { CompareService } from './service/compare.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(
    public electronService: ElectronService,
    public compare: CompareService,
  ) {
    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  title = 'mysql-sync';

  ngOnInit(): void {
  }

  @HostListener('window:beforeunload', ['$event'])
  exit() {
    this.compare.exit();
  }
}
