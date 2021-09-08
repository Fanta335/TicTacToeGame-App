const config = {
  target: document.getElementById("target"),
};

class View {
  static createMainPage() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-dark vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-white pb-5">Tic Tac Toe Game</h1>
        <div id='gameTable' class="col-8 bg-white d-flex flex-column align-items-center p-3">
        </div>
      </div>
    `;

    let tableCon = container.querySelectorAll("#gameTable")[0];
    tableCon.append(View.createGameTable());

    config.target.append(container);
  }

  static createGameTable() {
    let container = document.createElement("table");
    container.classList.add("col-12", "table", "table-bordered", "text-center");
    container.innerHTML = `
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
        </tr>
        <tr>
          <td>4</td>
          <td>5</td>
          <td>6</td>
        </tr>
        <tr>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
      </tbody>
    `;

    return container;
  }
}

class Controller {
  static startGame() {
    View.createMainPage();
  }
}

Controller.startGame();
