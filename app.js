const config = {
  target: document.getElementById("target"),
};

class Player {
  constructor(name, turn, mark, isAI) {
    this.name = name;
    this.isTurn = turn;
    this.mark = mark;
    this.isAI = isAI;
  }
}

class GameTable {
  currentTable;
  winPatterns;

  // static setInitialTable(row, column){
  //   this.initialTable = Array.from(Array(row*column).keys());
  // }

  static initializeCurrentTable() {
    this.currentTable = {};
  }

  static setWinnerPatterns(row) {
    // row x rowの正方形のtableで計算する
    let resultPatterns = [];

    // row
    let rowPattern = Array.from(Array(row).keys());
    let rowCount = 0;
    while (rowCount < row) {
      resultPatterns.push(rowPattern.map((i) => i + row * rowCount));
      rowCount++;
    }

    // column
    let columnPattern = rowPattern.map((i) => i * row);
    let columnCount = 0;
    while (columnCount < row) {
      resultPatterns.push(columnPattern.map((i) => i + columnCount));
      columnCount++;
    }

    // diagonal (always 2 patterns)
    resultPatterns.push(rowPattern.map((i) => i * (row + 1)));
    resultPatterns.push(rowPattern.map((i) => (i + 1) * (row - 1)));

    this.winPatterns = resultPatterns;
  }

  static recordMark(position, mark) {
    this.currentTable[position] = mark;
  }

  static judgeWinner(player) {
    for (let i = 0; i < this.winPatterns.length; i++) {
      let pattern = this.winPatterns[i];
      let count = 0;
      for (let j = 0; j < pattern.length; j++) {
        let position = pattern[j];
        if (GameTable.currentTable[position] === undefined) break;
        if (GameTable.currentTable[position] === player.mark) count++;
        if(count === pattern.length) return true;
      }
    }
    return false;
  }
}

class View {
  static createMainPage(player, row, column) {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-dark vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-white pb-5">Tic Tac Toe Game</h1>
        <h3 class="text-white">Player Name: ${player.name}</h3>
        <div id='gameTableContainer' class="col-8 bg-white d-flex flex-column align-items-center p-3">
        </div>
      </div>
    `;

    let tableCon = container.querySelectorAll("#gameTableContainer")[0];
    tableCon.append(View.createGameTable(player, row, column));

    config.target.append(container);
  }

  static createGameTable(player, row, column) {
    let container = document.createElement("table");
    container.classList.add("col-12", "table", "table-bordered", "text-center");

    container.append(View.setTableBody(player, row, column));
    return container;
  }

  static setTableBody(player, row, column) {
    let container = document.createElement("tbody");
    let rowArray = View.setRow(row);
    rowArray.forEach((tr, index) => {
      let tdArray = View.setColumn(player, column);
      tdArray.forEach((td) => {
        td.dataset.position = Number(td.dataset.position) + index * column;
        tr.append(td);
      });

      container.append(tr);
    });

    return container;
  }

  static setRow(row) {
    let trArray = [];
    let count = 0;

    while (count < row) {
      trArray.push(document.createElement("tr"));
      count++;
    }

    return trArray;
  }

  static setColumn(player, column) {
    let tdArray = [];
    let count = 0;

    while (count < column) {
      let td = document.createElement("td");
      td.classList.add("align-middle", "display-4");
      td.innerHTML = "&nbsp;"; // 空白文字
      td.setAttribute("data-position", count);
      td.addEventListener("click", (event) => {
        Controller.playerAction(player, td);
      });
      tdArray.push(td);
      count++;
    }

    return tdArray;
  }

  static printMark(player, target) {
    if (target.innerHTML === "&nbsp;") target.innerHTML = player.mark;
  }
}

class Controller {
  static startGame() {
    let player = new Player("fanta", true, "O", false); // 先攻
    let row = 3;
    let column = 3;
    View.createMainPage(player, row, column);
    GameTable.initializeCurrentTable();
    GameTable.setWinnerPatterns(row);
  }

  static playerAction(player, target) {
    View.printMark(player, target);
    GameTable.recordMark(target.dataset.position, player.mark);
    let judge = GameTable.judgeWinner(player);
    if(judge) console.log('win')
  }
}

Controller.startGame();
