import { Component } from '@angular/core';

class SudokuSolver {
	board = [];
	solve_time = 0;
	puzzle = [];
	solution = [];
	conditions = [];

	constructor() {
		this.conditions = [this.checkRow, this.checkCol, this.checkBox];
	}

	checkRow = (board, position, num) => {
		return board[position[0]].indexOf(num) === -1;
	};

	checkCol = (board, position, num) => {
		return board.map(row => row[position[1]]).indexOf(num) === -1;
	};

	checkBox = (board, position, num) => {
		let row = position[0];
		let col = position[1];
		let r = Math.floor(row / 3);
		let c = Math.floor(col / 3);
		return (
			[]
				.concat(
					...board.slice(3 * r, 3 * (r + 1)).map(row => row.slice(3 * c, 3 * (c + 1))),
				)
				.indexOf(num) === -1
		);
	};

	checkPuzzle = () => {
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				let board = [];
				this.puzzle.forEach(row => board.push([...row]));
				if (board[i][j] !== 0) {
					let tmp = board[i][j];
					board[i][j] = 0;
					if (!this.conditions.map(f => f(board, [i, j], tmp)).every(x => x === true))
						return false;
				}
			}
		}
		return true;
	};

	solve = board => {
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (board[i][j] !== 0) continue;
				let ss = [];
				for (let tmp_i = 1; tmp_i < 10; tmp_i++) {
					if (this.conditions.map(f => f(board, [i, j], tmp_i)).every(x => x === true))
						ss.push(tmp_i);
				}
				if (ss.length === 0) return false;
				if (ss.length === 1) {
					board[i][j] = ss[0];
					return this.solve(board);
				} else {
					for (let num of ss) {
						let tmp = [];
						board.forEach(row => tmp.push([...row]));
						tmp[i][j] = num;
						tmp = this.solve(tmp);
						if (tmp) return tmp;
					}
					return false;
				}
			}
		}
		this.solution = board;
		return board;
	};
}

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	loader = false;
	error = '';
	selected_cell;
	samples = [
		[
			[0, 0, 0, 0, 0, 4, 7, 0, 8],
			[0, 0, 0, 0, 0, 8, 0, 0, 3],
			[0, 0, 0, 2, 1, 5, 0, 0, 0],
			[0, 0, 7, 0, 0, 0, 0, 9, 6],
			[8, 0, 0, 0, 9, 0, 0, 0, 0],
			[0, 0, 4, 1, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 4, 0, 5, 0, 0],
			[0, 0, 0, 0, 0, 0, 2, 0, 0],
			[2, 5, 0, 0, 0, 0, 0, 8, 0],
		],
		[
			[6, 0, 9, 1, 0, 2, 0, 8, 0],
			[0, 0, 0, 0, 0, 0, 4, 0, 0],
			[5, 0, 2, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 2, 0, 3, 0, 4],
			[1, 0, 0, 0, 0, 5, 0, 0, 0],
			[0, 2, 0, 0, 0, 0, 5, 0, 6],
			[0, 0, 0, 8, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 9],
			[8, 0, 5, 9, 0, 7, 0, 4, 0],
		],
		[
			[3, 0, 0, 5, 0, 0, 0, 9, 0],
			[0, 0, 0, 0, 0, 0, 3, 0, 0],
			[7, 2, 4, 1, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 9, 6, 0, 5],
			[0, 0, 5, 0, 1, 2, 0, 0, 4],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 7, 0, 4, 3, 5, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 7, 0, 8, 0, 1],
		],
		[
			[0, 0, 0, 8, 0, 0, 0, 0, 9],
			[0, 0, 0, 2, 7, 3, 0, 0, 0],
			[0, 0, 0, 5, 0, 0, 1, 0, 8],
			[0, 8, 0, 0, 4, 0, 0, 0, 0],
			[0, 0, 5, 0, 0, 7, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 4, 6],
			[0, 0, 0, 0, 0, 0, 3, 0, 0],
			[2, 3, 0, 0, 0, 0, 0, 8, 0],
			[7, 0, 0, 0, 5, 0, 2, 0, 0],
		],
		[
			[0, 0, 0, 0, 5, 0, 8, 0, 0],
			[0, 0, 7, 0, 0, 1, 6, 0, 0],
			[0, 0, 0, 7, 0, 2, 0, 3, 0],
			[0, 0, 8, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 2, 9, 0, 3, 7, 0],
			[4, 0, 0, 0, 0, 0, 0, 0, 5],
			[8, 0, 2, 0, 0, 7, 0, 0, 0],
			[0, 4, 0, 0, 3, 0, 0, 1, 8],
			[0, 0, 6, 0, 0, 0, 0, 0, 0],
		],
		[
			[6, 0, 0, 0, 0, 0, 0, 5, 0],
			[9, 0, 0, 8, 3, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0, 3],
			[0, 0, 0, 0, 0, 2, 0, 0, 0],
			[0, 5, 0, 0, 0, 7, 0, 0, 6],
			[0, 7, 2, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 4, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 7, 2, 5],
			[0, 0, 0, 1, 0, 9, 6, 0, 0],
		],
	];
	SS = new SudokuSolver();

	constructor() {
		this.setPuzzle(1);
	}

	solve() {
		let time = Date.now();
		if (!this.SS.checkPuzzle()) {
			this.error = 'Given puzzle not solvable!';
			this.SS.solve_time = 0;
		} else {
			this.loader = true;
			setTimeout(() => {
				this.SS.solve(this.SS.puzzle);
				if (this.SS.solution.length !== 0) {
					this.SS.solve_time = (Date.now() - time) / 1000;
					this.SS.board = this.SS.solution;
				} else this.error = 'Given puzzle is not solvable!';
				this.loader = false;
			}, 100);
		}
	}

	setPuzzle(num) {
		this.SS.puzzle = [];
		this.samples[num - 1].forEach(row => this.SS.puzzle.push([...row]));
		this.SS.board = this.SS.puzzle;
	}

	sudokuInp(num) {
		if (!this.selected_cell) return;
		let i = this.selected_cell.parentNode.rowIndex;
		let j = this.selected_cell.cellIndex;
		this.SS.board[i][j] = num;
	}

	selectCell(x) {
		if (this.selected_cell) {
			this.selected_cell.classList.remove('selected-cell');
		}
		this.selected_cell = x.target;
		this.selected_cell.classList.add('selected-cell');
	}
}
