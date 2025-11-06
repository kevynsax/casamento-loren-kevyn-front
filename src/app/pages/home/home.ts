import { Component } from '@angular/core';
import { Menu } from '../../menu/menu';
import { Cover } from '../../cover/cover';
import { Story } from '../../story/story';
import { Footer } from '../../footer/footer';
import { Portfolio } from '../../portfolio/portfolio';
import { Shop } from '../../shop/shop';

@Component({
  selector: 'app-home',
    imports: [
        Menu,
        Cover,
        Story,
        Footer,
        Portfolio,
        Shop
    ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
