const config = {
  target: document.getElementById("target"),
};

class View {
  static createMainPage() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-dark vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-white pb-5">Tic Tac Toe Game</h1>
        <div id='gameTableContainer' class="col-8 bg-white d-flex flex-column align-items-center p-3">
        </div>
      </div>
    `;

    let tableCon = container.querySelectorAll("#gameTableContainer")[0];
    tableCon.append(View.createGameTable());

    config.target.append(container);
  }

  static createGameTable() {
    let container = document.createElement("table");
    container.classList.add("col-12", "table", "table-bordered", "text-center");

    container.append(View.setTableBody(3, 3));
    return container;
  }

  static setTableBody(row, column) {
    let container = document.createElement("tbody");
    let rowArray = View.setRow(row);
    rowArray.forEach((tr) => {
      let tdArray = View.setColumn(column);
      tdArray.forEach((td) => {
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

  static setColumn(column) {
    let tdArray = [];
    let count = 0;

    while (count < column) {
      tdArray.push(document.createElement("td"));
      count++;
    }

    return tdArray;
  }
}

class Controller {
  static startGame() {
    View.createMainPage();
  }
}

Controller.startGame();
