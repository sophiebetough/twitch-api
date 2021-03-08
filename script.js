const url = "https://api.twitch.tv/kraken";
// stream 模板
const template = `<li class="stream__card">
  <div class="stream__image">
    <img src=$preview />
  </div>
  <div class="stream__content">
    <div class="stream__avatar">
      <img src=$logo />
    </div>
    <div class="stream__desc">
      <div class="stream__desc-title">
        $title
      </div>
      <div class="stream__desc-channel">
        $channel
      </div>
    </div>
  </div>					
</li>
`;

// 拿取 API 資料：熱門遊戲資訊
function getGames(cb) {
  const request = new XMLHttpRequest();
  request.open("GET", url + `/games/top?limit=5`, true);
  request.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
  request.setRequestHeader("Client-ID", "4jjphhdum2jypfqzd7hrli6cgf8rpr");

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    }
  };

  request.onerror = function () {
    console.log("error");
  };
  request.send();
}

// 拿取 API 資料：實況頻道資訊
function getStreams(name, cb) {
  const request = new XMLHttpRequest();
  // encodeURIComponent：若有特殊符號會將原字串做編碼
  request.open("GET", url + "/streams?game=" + encodeURIComponent(name), true);
  request.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
  request.setRequestHeader("Client-ID", "4jjphhdum2jypfqzd7hrli6cgf8rpr");

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    }
  };
  request.onerror = function () {
    console.log("error");
  };
  request.send();
}

// 取得前五名的遊戲名稱
getGames((games) => {
  const topGames = games.top.map((games) => games.game.name);
  for (const game of topGames) {
    const element = document.createElement("li");
    element.innerHTML = game;
    document.querySelector(".navbar__list").appendChild(element);
  }
  getStreams(topGames[0], (data) => {
    appendStreams(data.streams);
    addEmptyBlock();
    addEmptyBlock();
  });
});

// 監聽點擊事件，事件代理切換選單頻道
document.querySelector(".navbar__list").addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    const text = e.target.innerText;
    document.querySelector("h1").innerText = text;
    document.querySelector(".streams").innerHTML = "";

    getStreams(text, (data) => {
      appendStreams(data.streams);
      addEmptyBlock();
      addEmptyBlock();
    });
  }
});

// 空白卡片函式
function addEmptyBlock() {
  const block = document.createElement("li");
  block.classList.add("stream__empty");
  document.querySelector(".streams").appendChild(block);
}

function appendStreams(streams) {
  const gameTitle = document.querySelector("h1");
  gameTitle.textContent = streams[0].game;

  streams.forEach((stream) => {
    const element = document.createElement("li");
    const content = template
      .replace("$preview", stream.preview.large)
      .replace("$logo", stream.channel.logo)
      .replace("$title", stream.channel.status)
      .replace("$channel", stream.channel.name);
    document.querySelector(".streams").appendChild(element);
    element.outerHTML = content;
  });
}
