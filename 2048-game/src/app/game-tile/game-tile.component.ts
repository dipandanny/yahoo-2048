import { Component, OnInit, Input } from '@angular/core';
import { Tile } from '../shared/tile.model';
@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss']
})
export class GameTileComponent implements OnInit {
  @Input() tile: Tile = {
    value: 0,
    position: {
      x: 0,
      y: 0
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

}
