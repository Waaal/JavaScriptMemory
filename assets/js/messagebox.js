const colorMapping = ["darkred", "orange", "limegreen", "purple"];
const iconMapping = ["&#10060;", "&#x26A0;", "&#10004;", "&#x1F389;"];

function generateMessageBox(col, icon, text)
{
    let messageBox = document.createElement("div");
    messageBox.classList.add("message-container");

    let mColor = document.createElement("div");
    mColor.classList.add("message-container-color");

    let mIcon = document.createElement("div");
    mIcon.classList.add("message-container-icon");
    let mIconSpan = document.createElement("span");

    let mText = document.createElement("div");
    mText.classList.add("message-container-text");

    mColor.style.backgroundColor = colorMapping[col];
    mIconSpan.innerHTML = iconMapping[icon];
    mText.innerHTML = text;

    mIcon.appendChild(mIconSpan);

    messageBox.appendChild(mColor);
    messageBox.appendChild(mIcon);
    messageBox.appendChild(mText);

    document.getElementById("body-ID").appendChild(messageBox);

    messageBox.classList.add("show");

    setTimeout(function()
    {
        deleteMessageBox(messageBox);
    }, 3000);
}

function deleteMessageBox(element)
{
    element.remove();
}