let gameList;
let gameListContainer

window.onload = function()
{
    gameList = localStorage.getItem("gameList").split("\n");
    gameListContainer = document.getElementById("game-container-ID");
    renderGames();
}

function renderGames()
{
    for(let i = gameList.length-1; i >= 0; i--)
    {
        let obj = JSON.parse(gameList[i]);

        let gameContainerItem = document.createElement("div");
        gameContainerItem.classList.add("game-container-item");

        let headline = document.createElement("h3");
        headline.innerHTML = "Memory game <span CLASS = 'grey'>#"+obj.ID+"</span>";

        gameContainerItem.appendChild(headline);

        let wonText = obj.data.won;
        if(wonText)
        {
            wonText = "Won";
        }
        else
        {
            wonText = "Lose";
        }
        gameContainerItem.innerHTML += "<span><b>Player:</b> "+obj.data.user+"</span><span><b>Difficulty:</b> "+obj.data.difficulty+"</span><span><b>Time:</b> "+obj.data.timeLimit+" </span><span><b>End:</b> "+wonText+"</span>";

        let moreDiv = document.createElement("div");
        moreDiv.classList.add("more-info");

        let arrow = document.createElement("span");
        arrow.classList.add("arrow");
        arrow.innerHTML = "Δ";

        arrow.addEventListener("click", function(){
            if(!moreDiv.classList.contains("show-more"))
            {
                moreDiv.classList.add("show-more");
                arrow.classList.add("arrow-open");
            }
            else
            {
                moreDiv.classList.remove("show-more");
                arrow.classList.remove("arrow-open");
            }
        });

        moreDiv.innerHTML = "<span><b>Total cards:</b> "+obj.data.cards+"</span><span><b>Collected cards:</b> "+obj.data.collected+"</span><span><b>Clicked cards:</b> "+obj.data.clicked+"</span><span><b>Time needed:</b> "+obj.data.timeNeeded+"</span>";

        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Show recap";
        btn.id = obj.ID;
        btn.onclick = clickGameContainer;

        moreDiv.appendChild(btn);

        gameContainerItem.appendChild(arrow);
        gameContainerItem.appendChild(moreDiv);

        //gameContainerItem.addEventListener("click", clickGameContainer);

        gameListContainer.appendChild(gameContainerItem);
    }
}

function clickGameContainer(e)
{
    let currentRecap;
    for(let i = 1; i < gameList.length; i++)
    {
        let obj = JSON.parse(gameList[i])
        if(obj.ID == e.currentTarget.id)
        {
            currentRecap = obj.recapData;
        }
    }

    localStorage.setItem("recap", JSON.stringify(currentRecap));

    window.location = "recap.html";
}