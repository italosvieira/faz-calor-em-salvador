import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private sanitizer: DomSanitizer) {}

  // Classes
  /*tamanhoTabs;*/
  tamanhoBanner;

  banner;
  /*abaSelecionada;*/

  getBackGround() {
    return this.sanitizer.bypassSecurityTrustStyle(`url(/assets/images/${this.banner})`);
  }

  ngOnInit(): void {
    this.banner = 'banner2.jpg';
    /*this.abaSelecionada = 1;*/
    /*this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.abaSelecionada = 1;
        } else if (event.url === '/estatisticas') {
          this.abaSelecionada = 2;
        } else if (event.url === '/sobre') {
          this.abaSelecionada = 3;
        }
      }});

    if (!this.abaSelecionada) {
      console.log('aqui');
      this.abaSelecionada = 1;
    }*/

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        /*console.log('Is XSmall');*/
        this.tamanhoBanner = 'is-medium';
        /*this.tamanhoTabs = 'is-small';*/
        // max-width = 599.99px
      }
      if (result.breakpoints[Breakpoints.Small]) {
        /*console.log('Is Small');*/
        this.tamanhoBanner = 'is-medium';
        /*this.tamanhoTabs = 'is-medium';*/
        // min-width = 600px and max-width = 959.99px
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        /*console.log('Is Medium');*/
        this.tamanhoBanner = 'is-medium';
        /*this.tamanhoTabs = 'is-medium';*/
        // 960px and max-width = 1279.99px
      }
      if (result.breakpoints[Breakpoints.Large]) {
        /*console.log('Is Large');*/
        this.tamanhoBanner = 'is-medium';
        /*this.tamanhoTabs = 'is-medium';*/
        // 1280px and max-width = 1919.99px
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        /*console.log('Is XLarge');*/
        this.tamanhoBanner = 'is-large';
        /*this.tamanhoTabs = 'is-large';*/
        // 1920px
      }
    });

  // @media (min-width: 320px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-460x305.jpg);
  //     }
  //   }
  //
  // @media (min-width: 460px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-720x477.jpg);
  //     }
  //   }
  //
  // @media (min-width: 720px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-980x649.jpg);
  //     }
  //   }
  //
  // @media (min-width: 980px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-1240x821.jpg);
  //     }
  //   }
  //
  // @media (min-width: 1240px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-1500x993.jpg);
  //     }
  //   }
  //
  // @media (min-width: 1500px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-1760x1166.jpg);
  //     }
  //   }
  //
  // @media (min-width: 1760px) {
  //   .hero::before {
  //       background-image: url(/img/background-1932466_1920-1920x1271.jpg);
  //     }
  //   }
  }

  /*async selecionarAba(aba: number) {
    if (aba) {
      if (aba === 1) {
        this.abaSelecionada = 1;
        await this.router.navigate(['']);
        return;
      } else if (aba === 2) {
        this.abaSelecionada = 2;
        await this.router.navigate(['estatisticas']);
        return;
      } else if (aba === 3) {
        this.abaSelecionada = 3;
        await this.router.navigate(['sobre']);
        return;
      }
    }

    this.abaSelecionada = 1;
    await this.router.navigate(['']);
  }*/
}
