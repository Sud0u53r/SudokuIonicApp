import { Component } from '@angular/core';

class SudokuSolver {
	board = [];
	solve_time = 0;
	constructor() {}

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

	checkPuzzle = (board = this.board) => {
		return true;
	};

	solve = (board = this.board) => {
		let conditions = [this.checkRow, this.checkCol, this.checkBox];
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (board[i][j] !== 0) continue;
				let ss = [...Array(9).keys()]
					.map(n => [
						n + 1,
						conditions.map(f => f(board, [i, j], n + 1)).every(x => x === true),
					])
					.filter(x => x[1])
					.map(x => x[0]);
				if (ss.length === 0) return false;
				else if (ss.length === 1) {
					board[i][j] = ss[0];
					return this.solve(board);
				} else {
					for (let num of ss) {
						let tmp = JSON.parse(JSON.stringify(board));
						tmp[i][j] = num;
						let tt = this.solve(tmp);
						if (tt) return tt;
					}
					return false;
				}
			}
		}
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
	samples = [
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
	];
	SS = new SudokuSolver();
	constructor() {
		this.SS.board = this.samples[0];
	}

	solve() {
		if (!this.SS.checkPuzzle()) {
			this.error = 'Given puzzle not solvable!';
		} else {
			this.loader = true;
			setTimeout(() => {
				let time = Date.now();
				this.SS.board = this.SS.solve();
				this.SS.solve_time = Date.now() - time;
				setTimeout(() => (this.SS.solve_time = 0));
				this.loader = false;
			}, 100);
		}
	}

	selectPuzzle(num) {
		this.SS.board = this.samples[num - 1];
	}

	sudokuInp(num) {
		return;
	}
}
