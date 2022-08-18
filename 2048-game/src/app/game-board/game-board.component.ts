import { animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Tile } from '../shared/tile.model';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.keyDown(event.key);
  }
  tiles: Tile[] = [];
  dimension = 4;
  constructor() { }

  ngOnInit(): void {
    const random1 = Math.floor(Math.random() * this.dimension * this.dimension);
    let random2 = 0;
    while (!random2 || random2 === random1) {
      random2 = Math.floor(Math.random() * this.dimension * this.dimension);
    }
    const twoOrFour = [2, 4];
    for(let i = 0; i < 16; i++){
      let value = 0;
      if (i === random1 || i === random2) {
        value = twoOrFour[Math.floor(Math.random() * 2)];
      }
      this.tiles.push({value, position: this.generatePositionFromIndex(i)});
    }
  }

  generatePositionFromIndex(index: number) {
    return {
      x: index % this.dimension,
      y: Math.floor(index/this.dimension)
    }
  }
  generateIndexFromPosition(position: any) {
    return position.x + position.y * this.dimension;
  }
  keyDown(key: string) {
    if (key === 's') {
      const columns: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < this.tiles.length; i++) {
        columns[this.tiles[i].position.x].push(this.tiles[i].value);
      }
      
      const newColumns: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < columns.length; i++) {
        newColumns[i] = this.calculateColumn(columns[i], 'down');
        console.log('newColumn', newColumns[i]);
      }
      
      for (let i = 0; i < newColumns.length; i++) {
        for (let j = 0 ; j < newColumns[0].length; j++) {
          this.tiles[this.generateIndexFromPosition({x: i, y:j})] = {
            value: newColumns[i][j],
            position: {
              x: i,
              y: j
            }
          }
        }
      }
    }
    if (key === 'w') {
      const columns: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < this.tiles.length; i++) {
        columns[this.tiles[i].position.x].push(this.tiles[i].value);
      }
      
      const newColumns: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < columns.length; i++) {
        newColumns[i] = this.calculateColumn(columns[i], 'up');
      }
      for (let i = 0; i < newColumns.length; i++) {
        for (let j = 0 ; j < newColumns[0].length; j++) {
          this.tiles[this.generateIndexFromPosition({x: i, y:j})] = {
            value: newColumns[i][j],
            position: {
              x: i,
              y: j
            }
          }
        }
      }
    }
    if (key === 'a') {
      const rows: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < this.tiles.length; i++) {
        rows[this.tiles[i].position.y].push(this.tiles[i].value);
      }
      console.log(rows);
      const newRows: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < rows.length; i++) {
        newRows[i] = this.calculateRow(rows[i], 'left');
      }
      for (let i = 0; i < newRows.length; i++) {
        for (let j = 0 ; j < newRows[0].length; j++) {
          this.tiles[this.generateIndexFromPosition({x: j, y: i })] = {
            value: newRows[i][j],
            position: {
              x: j,
              y: i
            }
          }
        }
      }
    }
    if (key === 'd') {
      const rows: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < this.tiles.length; i++) {
        rows[this.tiles[i].position.y].push(this.tiles[i].value);
      }
      console.log(rows);
      const newRows: number[][] = new Array(this.dimension).fill(0).map((element) => []);
      for (let i = 0; i < rows.length; i++) {
        newRows[i] = this.calculateRow(rows[i], 'right');
      }
      for (let i = 0; i < newRows.length; i++) {
        for (let j = 0 ; j < newRows[0].length; j++) {
          this.tiles[this.generateIndexFromPosition({x: j, y: i })] = {
            value: newRows[i][j],
            position: {
              x: j,
              y: i
            }
          }
        }
      }
    }
    this.populatingNewValues();
  }
  populatingNewValues() {
    const emptySpaces = [];
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].value === 0) {
        emptySpaces.push(i);
      }
    }
    if (emptySpaces.length === 0) {
      return;
    }
    const random = Math.floor(Math.random() * (emptySpaces.length - 1));
    const twoOrFour = [2, 4];
    this.tiles[emptySpaces[random]].value = twoOrFour[Math.floor(Math.random() * 2)];
  }
  calculateRow(row: number[], direction: string) {
    let valueArr: number[] = [];
    let currValue = 0;
    let currIndex = 0;
    let addedMap = new Map();
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        continue;
      }
      if (currValue === 0) {
        currValue = row[i];
        currIndex = i;
        continue;
      }
      if (currValue === row[i]) {
        console.log(currValue, row[i], i, currIndex);
        valueArr.push(currValue += row[i]);
        addedMap.set(i, 0);
        addedMap.set(currIndex, 0);
        currValue = 0;
        currIndex = 0;
      } else {
        currValue = row[i];
        currIndex = i;
      }
    }

    let res: any = [];
    if (direction === 'right') {
      row.forEach((element, index) => {
        if (!addedMap.has(index) && element !== 0) {
          valueArr.push(element);
        }
      });
      for (let i = 0; i < row.length - valueArr.length; i++) {
        res.push(0);
      }
      res = [ ...res,...valueArr];
    }
    if (direction === 'left') {
      row.forEach((element, index) => {
        if (!addedMap.has(index) && element !== 0) {
          valueArr.push(element);
        }
      });
      for (let i = 0; i < row.length - valueArr.length; i++) {
        res.push(0);
      }
      
      res = [ ...valueArr,...res];
    }
    return res;
  }
  calculateColumn(column: number[], direction: string) {
    console.log(column);
    let valueArr: number[] = [];
    let currValue = 0;
    let currIndex = 0;
    let addedMap = new Map();
    for (let i = 0; i < column.length; i++) {
      if (column[i] === 0) {
        continue;
      }
      if (currValue === 0) {
        currValue = column[i];
        currIndex = i;
        continue;
      }
      if (currValue === column[i]) {
        valueArr.push(currValue += column[i]);
        addedMap.set(i, 0);
        addedMap.set(currIndex, 0);
        currValue = 0;
        currIndex = 0;
      } else {
        currValue = column[i];
        currIndex = i;
      }
    }
    console.log('value', valueArr);
    let res: any = [];
    if (direction === 'down') {
      column.forEach((element, index) => {
        if (!addedMap.has(index) && element !== 0) {
          valueArr.push(element);
        }
      });
      for (let i = 0; i < column.length - valueArr.length; i++) {
        res.push(0);
      }
      res = [ ...res,...valueArr];
      
      console.log('res', res);
    }
    if (direction === 'up') {
      column.forEach((element, index) => {
        if (!addedMap.has(index) && element !== 0) {
          valueArr.push(element);
        }
      });
      for (let i = 0; i < column.length - valueArr.length; i++) {
        res.push(0);
      }
      
      res = [ ...valueArr,...res];
    }
    return res;
  }
}
