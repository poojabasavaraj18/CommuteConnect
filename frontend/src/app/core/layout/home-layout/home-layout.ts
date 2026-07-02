import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    Navbar,
    RouterOutlet
  ],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.scss'
})
export class HomeLayout {}