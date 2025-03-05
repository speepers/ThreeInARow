(() => {

    let controlsContainer = document.createElement("div");
    controlsContainer.classList.add("controls-container");
    document.body.appendChild(controlsContainer);

    let leftControls = document.createElement("div");
    leftControls.classList.add("left-controls");

    let buttonPrompt = document.createElement("div");
    buttonPrompt.classList.add("button-prompt");
    buttonPrompt.innerHTML = "Click me to reveal how you're doing.";
    leftControls.appendChild(buttonPrompt);

    let buttonRow = document.createElement("div");
    buttonRow.classList.add("button-row");

    let buttonNode = document.createElement("button");
    buttonNode.classList.add("button");
    buttonNode.innerHTML = "click me";
    buttonRow.appendChild(buttonNode);

    let buttonResult = document.createElement("div");
    buttonResult.classList.add("buttonText");
    buttonRow.appendChild(buttonResult);

    leftControls.appendChild(buttonRow);
    controlsContainer.appendChild(leftControls);

    let checkboxControls = document.createElement("div");
    checkboxControls.classList.add("checkbox-controls");

    let checkboxPrompt = document.createElement("div");
    checkboxPrompt.classList.add("checkbox-prompt");
    checkboxPrompt.innerHTML = "Click me to reveal any mistakes.";
    checkboxControls.appendChild(checkboxPrompt);

    let checkboxNode = document.createElement("input");
    checkboxNode.type = "checkbox";
    checkboxNode.classList.add("checkbox");
    checkboxControls.appendChild(checkboxNode);

    controlsContainer.appendChild(checkboxControls);

    function clickFunction(squareElement) {
        if (squareElement.dataset.canToggle !== "true") {
            return;
        }
    
        let currentState = parseInt(squareElement.dataset.currentState);
        switch (currentState) {
            case 0:
                squareElement.style.backgroundColor = "rgb(0, 64, 255)";
                squareElement.dataset.currentState = 1;
                break;
            case 1:
                squareElement.style.backgroundColor = "rgb(255, 255, 255)";
                squareElement.dataset.currentState = 2;
                break;
            case 2:
                squareElement.style.backgroundColor = "rgb(127, 127, 127)";
                squareElement.dataset.currentState = 0;
                break;
        }
    
        let updatedState = parseInt(squareElement.dataset.currentState);
        let correctState = parseInt(squareElement.dataset.correctState);
        let exMarkImg = squareElement.querySelector(".exMark");
    
        if (checkboxNode.checked) {
            if (updatedState === 0) {
                if (exMarkImg) {
                    squareElement.removeChild(exMarkImg);
                }
            } else if (updatedState !== correctState) {
                if (!exMarkImg) {
                    let img = document.createElement("img");
                    img.classList.add("exMark");
                    img.style.width = "30px";
                    img.style.height = "30px";
                    img.src = "RedExMark.png";
                    squareElement.appendChild(img);
                }
            } else {
                if (exMarkImg) {
                    squareElement.removeChild(exMarkImg);
                }
            }
        } else {
            if (exMarkImg) {
                squareElement.removeChild(exMarkImg);
            }
        }
    }
    
    function getSquareStatus(nodes, incorrectSquares) {
        incorrectSquares.length = 0;
    
        for (let i = 0; i < totalLength; i++) {
            if (nodes[i].dataset.correctState != nodes[i].dataset.currentState && nodes[i].dataset.currentState != 0) {
                incorrectSquares.push(nodes[i]);
            }
        }
    
        for (let i = 0; i < incorrectSquares.length; i++) {
            if (checkboxNode.checked) {
                if (!incorrectSquares[i].querySelector(".exMark")) {
                    let img = document.createElement("img");
                    img.classList.add("exMark");
                    img.style.width = "30px";
                    img.style.height = "30px";
                    img.src = "RedExMark.png";
                    incorrectSquares[i].appendChild(img);
                }
            } else {
                let img = incorrectSquares[i].querySelector(".exMark");
                if (img) {
                    incorrectSquares[i].removeChild(img);
                }
            }
        }
    }

    const gridContainer = document.querySelector(".container");
    
    fetch("https://prog2700.onrender.com/threeinarow/sample")
        .then(response => response.json())
        .then(json => {
            window.totalLength = json.rows.length ** 2;
    
            gridContainer.style.gridTemplateColumns = `repeat(${json.rows.length}, 1fr)`; 
            gridContainer.style.gridTemplateRows = `repeat(${json.rows.length}, 1fr)`;
    
            const nodes = [];
            const incorrectSquares = [];
    
            for (let i = 1; i <= totalLength; i++) {
                let newNode = document.createElement("div");
                newNode.classList.add("square");
                newNode.dataset.number = i;
                newNode.style.backgroundColor = "#9F9E9E";
                gridContainer.appendChild(newNode);
                nodes.push(newNode);
            }
    
            for (let i = 0; i < json.rows.length; i++) {
                for (let j = 0; j < json.rows.length; j++) {
                    const index = i * json.rows.length + j;
                    nodes[index].dataset.canToggle = json.rows[i][j].canToggle;
                    nodes[index].dataset.currentState = json.rows[i][j].currentState;
                    nodes[index].dataset.correctState = json.rows[i][j].correctState;
                }
            }
    
            let cantModifyTotal = 0;
            for (let i = 0; i < totalLength; i++) {
                if (nodes[i].dataset.canToggle == "false") {
                    cantModifyTotal += 1;
                }
    
                switch(parseInt(nodes[i].dataset.currentState)) {
                    case 0:
                        nodes[i].style.backgroundColor = "rgb(127, 127, 127)";
                        break;
                    case 1:
                        nodes[i].style.backgroundColor = "rgb(0, 64, 255)";
                        break;
                    case 2:
                        nodes[i].style.backgroundColor = "rgb(255, 255, 255)";
                        break;
                }
            }
    
            buttonNode.addEventListener("click", () => {
                let correctCounter = 0;
                let incorrectCounter = 0;
                let grayCounter = 0;
    
                for (let i = 0; i < totalLength; i++) {
                    if (nodes[i].dataset.correctState == nodes[i].dataset.currentState) {
                        correctCounter += 1;
                    }
                    if (nodes[i].dataset.currentState == 0) {
                        grayCounter += 1;
                    }
                    if (nodes[i].dataset.correctState != nodes[i].dataset.currentState && nodes[i].dataset.currentState != 0) {
                        incorrectCounter += 1;
                    }
                }
    
                console.log("D E B U G");
                console.log("----------------------------");
                console.log("correct squares: " + correctCounter);
                console.log("squares you cant modify: " + cantModifyTotal);
                console.log("gray squares: " + grayCounter);
                console.log("incorrect squares: " + incorrectCounter);
                console.log("----------------------------");
    
                if (incorrectCounter >= 1) {
                    buttonResult.innerHTML = "Hmmm... I sense a mistake.";
                } else if (correctCounter === totalLength) {
                    buttonResult.innerHTML = "You did it! :D";
                } else if (correctCounter >= cantModifyTotal) {
                    buttonResult.innerHTML = "You have no mistakes so far.";
                }
            });
    
            checkboxNode.addEventListener("click", () => {
                getSquareStatus(nodes, incorrectSquares);
            });
    
            nodes.forEach(node => {
                node.addEventListener("click", (event) => {
                    clickFunction(event.currentTarget);
                });
            });
        });
})();
