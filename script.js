let canvas=document.querySelector("canvas");
let clear_all=document.querySelector(".eraser");
let download=document.querySelector(".download-section");

let colour_codes={
    black:'#000000',
    red:'#ff3f34',
    blue:'#0984e3',
    green:'#00b894',
    yellow:'#fbc531',
}

let width={
    w1:1,
    w2:3,
    w3:6,
}

let erase_width={
    ew1:7,
    ew2:12,
    ew3:18,
}

let pen_colour=document.querySelectorAll(".colors div");
let selected_colour=colour_codes["black"];
let prev_colour;

for(let i=0;i<pen_colour.length;i++){
    pen_colour[i].addEventListener("click",function(e){
        for(let i=0;i<pen_colour.length;i++){
            pen_colour[i].classList.remove("colour-selected");
        }

        e.currentTarget.classList.add("colour-selected");
        let curr_colour=e.currentTarget.classList[0];
        selected_colour=colour_codes[curr_colour];
    })
}

let pen_width=document.querySelectorAll(".marker-width div");
let selected_width=1;

for(let i=0;i<pen_width.length;i++){
    pen_width[i].addEventListener("click",function(e){
        for(let i=0;i<pen_width.length;i++){
            pen_width[i].classList.remove("width-selected");
        }

        for(let i=0;i<eraser_width.length;i++){
            eraser_width[i].classList.remove("eraser-selected");
        }

        e.currentTarget.classList.add("width-selected");
        let curr_width=e.currentTarget.classList[0];
        selected_width=width[curr_width];
        selected_colour=prev_colour;
    })
}

let eraser_width=document.querySelectorAll(".eraser-width div");

for(let i=0;i<eraser_width.length;i++){
    eraser_width[i].addEventListener("click",function(e){
        for(let i=0;i<eraser_width.length;i++){
            eraser_width[i].classList.remove("eraser-selected");
        }

        for(let i=0;i<pen_width.length;i++){
            pen_width[i].classList.remove("width-selected");
        }
        e.currentTarget.classList.add("eraser-selected");
        let curr_width=e.currentTarget.classList[0];
        selected_width=erase_width[curr_width];
        prev_colour=selected_colour;
        selected_colour="white";
    })
}

let isDrawing=false;

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let tool=canvas.getContext("2d");

tool_rect= tool.canvas.getBoundingClientRect();

window.addEventListener("mousedown",function(e){
    tool.beginPath();
    tool.moveTo(e.clientX - tool_rect.left, e.clientY - tool_rect.top);
    isDrawing=true;
})

window.addEventListener("mouseup",function(e){
    isDrawing=false;
})

window.addEventListener("mousemove",function(e){
    if(isDrawing){
        tool.lineTo(e.clientX - tool_rect.left, e.clientY - tool_rect.top);
        tool.strokeStyle=selected_colour;
        tool.lineWidth=selected_width;
        tool.stroke();
    }
})

clear_all.addEventListener("click",function(e){
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.beginPath();
})

download.addEventListener("click",function(e){
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="WhiteBoard.png";
    a.click();
    a.remove();
})