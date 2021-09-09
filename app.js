const config = {
  target: document.getElementById("target"),
  initialRowLength: 3,
};

class Player {
  constructor(name, turn, mark, isAI) {
    this.name = name;
    this.isTurn = turn;
    this.mark = mark;
    this.isAI = isAI;
  }
}

class PlayerList {
  userPlayer;
  AIPlayer;

  static setUserPlayer(player) {
    this.userPlayer = player;
  }

  static setAIPlayer() {
    this.AIPlayer = new Player("AI Player", false, "X", true);
  }
}

class GameTable {
  rowLength;
  currentTable;
  winPatterns;

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
        if (count === pattern.length) return true;
      }
    }
    return false;
  }

  static isDraw() {
    return Object.keys(GameTable.currentTable).length === Math.pow(GameTable.rowLength, 2);
  }

  static pickUpTargetPosition() {
    if (this.isDraw()) return;
    return this.pickUpTargetPositionHelper();
  }

  static pickUpTargetPositionHelper() {
    let randomPosition = Math.floor(Math.random() * Math.pow(GameTable.rowLength, 2));
    if (this.currentTable[randomPosition] === undefined) return randomPosition;
    else return this.pickUpTargetPositionHelper();
  }
}

class View {
  static createMainPage(player, row, column) {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-white pb-3">Tic Tac Toe Game</h1>
        <div id="optionContainer" class="row mb-4">
        </div>
        <h3 class="text-white pb-3">Player Name: ${player.name}</h3>
        <div id='gameTableContainer' class="col-8 bg-white d-flex flex-column align-items-center p-3">
        </div>
      </div>
    `;

    let optionCon = container.querySelectorAll("#optionContainer")[0];
    let tableCon = container.querySelectorAll("#gameTableContainer")[0];
    optionCon.append(View.createOption());
    tableCon.append(View.createGameTable(player, row, column));

    config.target.append(container);
  }

  static createOption() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="input-group mb-3">
        <input type="number" class="form-control" placeholder="Put number 3-10" min="3" max="10" value="3">
        <div class="input-group-append">
          <span class="input-group-text" id="basic-addon2">Rows</span>
        </div>
      </div>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#apply">Apply Settings</button>
      <div class="modal fade" id="apply" tabindex="-1" role="dialog" aria-labelledby="applyLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="applyLabel">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">Do you apply settings?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#replay">Replay</button>
      <div class="modal fade" id="replay" tabindex="-1" role="dialog" aria-labelledby="replayLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="replayLabel">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">Are your sure to Replay?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-danger">Replay</button>
            </div>
          </div>
        </div>
      </div>
    `;
    return container;
  }

  static createGameTable(player, row, column) {
    let container = document.createElement("table");
    container.classList.add("col-12", "table", "text-center");

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
        Controller.proceedTurn(player, td);
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
    PlayerList.setAIPlayer();
    GameTable.rowLength = config.initialRowLength;
    let row = GameTable.rowLength;
    let column = GameTable.rowLength;
    View.createMainPage(player, row, column);
    GameTable.initializeCurrentTable();
    GameTable.setWinnerPatterns(row);
  }

  static proceedTurn(player, targetDOM) {
    if (targetDOM.innerHTML !== "&nbsp;") return;

    Controller.playerAction(player, targetDOM);
    let judge = GameTable.judgeWinner(player);
    if (judge) {
      alert(`${player.name} Wins!!`);

      let retry = confirm("Play again?");
      if (retry) {
        config.target.innerHTML = "";
        Controller.startGame();
      }
    } else if (GameTable.isDraw()) {
      alert(`Draw!!`);

      let retry = confirm("Play again?");
      if (retry) {
        config.target.innerHTML = "";
        Controller.startGame();
      }
    } else Controller.AIAction();
  }

  static playerAction(player, targetDOM) {
    View.printMark(player, targetDOM);
    GameTable.recordMark(targetDOM.dataset.position, player.mark);
  }

  static AIAction() {
    let targetPosition = GameTable.pickUpTargetPosition();
    let targetDOM = document.querySelectorAll(`[data-position="${targetPosition}"]`)[0];
    View.printMark(PlayerList.AIPlayer, targetDOM);
    GameTable.recordMark(targetDOM.dataset.position, PlayerList.AIPlayer.mark);
    let judge = GameTable.judgeWinner(PlayerList.AIPlayer);
    if (judge) {
      alert(`${PlayerList.AIPlayer.name} Wins!!`);

      let retry = confirm("Play again?");
      if (retry) {
        config.target.innerHTML = "";
        Controller.startGame();
      }
    }
  }
}

Controller.startGame();
