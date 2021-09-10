const config = {
  target: document.getElementById("target"),
  defaultRowLength: 3,
};

class Player {
  constructor(name, mark, isAI) {
    this.name = name;
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
    this.AIPlayer = new Player("AI Player", "X", true);
  }
}

class GameTable {
  rowLength;
  currentTable;
  winPatterns;

  static initializeTable() {
    this.currentTable = {};
    this.winPatterns = [];
  }

  static initializeCurrentTable() {
    this.currentTable = {};
  }

  static setWinPatterns() {
    let row = this.rowLength;
    // row x rowの正方形のtableで計算する
    let resultPatterns = [];

    // row patterns
    let rowPattern = Array.from(Array(row).keys());
    let rowCount = 0;
    while (rowCount < row) {
      resultPatterns.push(rowPattern.map((i) => i + row * rowCount));
      rowCount++;
    }

    // column patterns
    let columnPattern = rowPattern.map((i) => i * row);
    let columnCount = 0;
    while (columnCount < row) {
      resultPatterns.push(columnPattern.map((i) => i + columnCount));
      columnCount++;
    }

    // diagonal patterns (2 patterns)
    resultPatterns.push(rowPattern.map((i) => i * (row + 1)));
    resultPatterns.push(rowPattern.map((i) => (i + 1) * (row - 1)));

    this.winPatterns = resultPatterns;
  }

  static addToCurrentTable(position, mark) {
    this.currentTable[position] = mark;
  }

  // winPatternsとcurrentTableを比較していき、いずれかのpatternがcurrentTableに含まれていたらtrue
  static checkWin(player) {
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

  // currentTableがすべて埋まったら引き分け
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
  static createMainPage() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="vh-100 d-flex flex-column align-items-center">
        <h1 class="text-white p-3">Tic Tac Toe Game</h1>
        <div id="optionContainer" class="row pb-4">
        </div>
        <h3 class="text-white pb-3">Player Name: ${PlayerList.userPlayer.name}</h3>
        <div id='gameTableContainer' class="col-8 bg-white d-flex flex-column align-items-center p-3">
        </div>
      </div>
    `;

    let optionCon = container.querySelectorAll("#optionContainer")[0];
    let tableCon = container.querySelectorAll("#gameTableContainer")[0];
    optionCon.append(View.createOption());
    tableCon.append(View.createGameTable(GameTable.rowLength));

    config.target.append(container);
  }

  static createOption() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="input-group mb-3">
        <input id="rowInput" type="number" class="form-control" placeholder="Put num 3-10" min="3" max="10" value="3">
        <div class="input-group-append">
          <span class="input-group-text">Rows</span>
        </div>
      </div>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#apply">Apply Option</button>
      <div class="modal fade" id="apply" tabindex="-1" role="dialog" aria-labelledby="applyLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="applyLabel">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">Do you apply option?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button id="confirmApplyButton" type="button" class="btn btn-primary" data-dismiss="modal">Apply</button>
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
              <button id="confirmReplayButton" type="button" class="btn btn-danger" data-dismiss="modal">Replay</button>
            </div>
          </div>
        </div>
      </div>
    `;

    let rowInput = container.querySelectorAll("#rowInput")[0];
    let confirmApplyButton = container.querySelectorAll("#confirmApplyButton")[0];
    let confirmReplayButton = container.querySelectorAll("#confirmReplayButton")[0];

    confirmApplyButton.addEventListener("click", (event) => {
      Controller.applyOptionAction(Number(rowInput.value));
    });

    confirmReplayButton.addEventListener("click", (event) => {
      Controller.replayAction();
    });

    return container;
  }

  static createGameTable(row) {
    let container = document.createElement("table");
    container.classList.add("col-12", "table", "text-center");

    container.append(View.setTableBody(row));
    return container;
  }

  static setTableBody(row) {
    let container = document.createElement("tbody");

    let trArray = View.setRow(row);
    trArray.forEach((tr, index) => {
      let tdArray = View.setColumn(row);
      tdArray.forEach((td) => {
        // 各マスに一意のdata-position属性を追加していく
        td.dataset.position = Number(td.dataset.position) + index * row;
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

  static setColumn(row) {
    let tdArray = [];
    let count = 0;

    while (count < row) {
      let td = document.createElement("td");
      td.classList.add("align-middle", "display-4");
      td.innerHTML = "&nbsp;"; // 空白文字
      td.setAttribute("data-position", count);
      td.addEventListener("click", (event) => {
        Controller.proceedTurn(td);
      });
      tdArray.push(td);
      count++;
    }

    return tdArray;
  }

  static printMark(player, target) {
    if (target.innerHTML === "&nbsp;") target.innerHTML = player.mark;
  }

  static createPopupWindow() {
    let container = document.createElement("div");
    container.classList.add("popupWindow");
    container.innerHTML = `
      <h1>POP UP WINDOW!</h1>
    `;
    config.target.append(container);
  }
}

class Controller {
  static startGame() {
    PlayerList.setUserPlayer(new Player("Test User", "O", false));
    PlayerList.setAIPlayer();
    GameTable.rowLength = config.defaultRowLength;
    View.createMainPage();
    GameTable.initializeTable();
    GameTable.setWinPatterns();
  }

  static proceedTurn(taragetElement) {
    if (taragetElement.innerHTML !== "&nbsp;") return;

    Controller.userPlayerAction(PlayerList.userPlayer, taragetElement);
    let judge = GameTable.checkWin(PlayerList.userPlayer);
    if (judge) {
      alert(`${PlayerList.userPlayer.name} Wins!!`);
      Controller.askToReplay();
    } else if (GameTable.isDraw()) {
      alert(`Draw!!`);
      Controller.askToReplay();
    } else Controller.AIPlayerAction();
  }

  static userPlayerAction(userPlayer, taragetElement) {
    View.printMark(userPlayer, taragetElement);
    GameTable.addToCurrentTable(taragetElement.dataset.position, userPlayer.mark);
  }

  static AIPlayerAction() {
    let targetPosition = GameTable.pickUpTargetPosition();
    let taragetElement = document.querySelectorAll(`[data-position="${targetPosition}"]`)[0];
    View.printMark(PlayerList.AIPlayer, taragetElement);
    GameTable.addToCurrentTable(taragetElement.dataset.position, PlayerList.AIPlayer.mark);
    let judge = GameTable.checkWin(PlayerList.AIPlayer);
    if (judge) {
      alert(`${PlayerList.userPlayer.name} Lose...`);
      Controller.askToReplay();
    } else if (GameTable.isDraw()) {
      alert(`Draw!!`);
      Controller.askToReplay();
    }
  }

  static askToReplay() {
    let replay = confirm("Play again?");
    if (replay) Controller.replayAction();
  }

  static applyOptionAction(newRowLength) {
    if (newRowLength < 3 || newRowLength > 10) {
      alert("Invalid row length. Input number 3-10.");
      return;
    }
    GameTable.rowLength = newRowLength;
    GameTable.initializeTable();
    GameTable.setWinPatterns(GameTable.rowLength);

    let gameTableCon = document.getElementById("gameTableContainer");
    gameTableCon.innerHTML = "";
    gameTableCon.append(View.createGameTable(newRowLength));
  }

  static replayAction() {
    GameTable.initializeTable();
    GameTable.setWinPatterns(GameTable.rowLength);

    let gameTableCon = document.getElementById("gameTableContainer");
    gameTableCon.innerHTML = "";
    gameTableCon.append(View.createGameTable(GameTable.rowLength));
  }
}

Controller.startGame();
