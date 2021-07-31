let canvas=document.querySelector("canvas");
let clear_all=document.querySelector(".eraser");
let download=document.querySelector(".download-section");
let undo_btn=document.querySelector(".undo");
let redo_btn=document.querySelector(".redo");
let body=document.querySelector("body");

let container=document.querySelector(".container");

let upload_img=document.querySelector(".upload-img");

let input=document.querySelector("#file");

canvas.style.cursor = "url('pen.png') 4 50, auto";

let undo=[];
let redo=[];

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
        prev_colour=selected_colour;
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
        canvas.style.cursor = "url('pen.png') 4 50, auto";
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
        canvas.style.cursor = "url('eraser.png') 4 50, auto";
    })
}

undo_btn.addEventListener("click",function(e){
    let redo_points=[];
    if(undo.length>=2){
        let idx=undo.length-1;
        while(undo[idx].id!="md"){
            redo_points.unshift(undo.pop());
            idx--;
        }
        redo_points.unshift(undo.pop());
    }

    redo.push(redo_points);
    tool.clearRect(0, 0, canvas.width, canvas.height);
    redraw();
})

redo_btn.addEventListener("click",function(e){
    if(redo.length==0){
        return;
    }

    let redo_points=redo.pop();

    for(let i=0;i<redo_points.length;i++){
        undo.push(redo_points[i]);
    }

    tool.clearRect(0, 0, canvas.width, canvas.height);
    redraw();
})

input.addEventListener("change",function(e){
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        img.onload = function(){
            tool.drawImage(img,20,20,200,250);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);  
})

function redraw(){
    for(let i=0;i<undo.length;i++){
        let obj=undo[i];
        tool.lineWidth=obj.width;
        tool.strokeStyle=obj.color;
        if(obj.id=="md"){
            tool.beginPath();
            tool.moveTo(obj.x,obj.y);
        }

        else{
            tool.lineTo(obj.x,obj.y);
            tool.stroke();
        }
    }
}

clear_all.addEventListener("click",function(e){
    undo=[];
    redo=[];
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

let isDrawing=false;

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let tool=canvas.getContext("2d");

tool_rect= tool.canvas.getBoundingClientRect();

canvas.addEventListener("mousedown",function(e){
    tool.beginPath();
    tool.moveTo(e.clientX - tool_rect.left, e.clientY - tool_rect.top);
    isDrawing=true;
    let obj={
        id:"md",
        x:e.clientX - tool_rect.left,
        y:e.clientY - tool_rect.top,
        color:tool.strokeStyle,
        width:tool.lineWidth,
    }

    undo.push(obj);
})

canvas.addEventListener("mouseup",function(e){
    isDrawing=false;
    console.log(undo)
})

canvas.addEventListener("mousemove",function(e){
    if(isDrawing){
        tool.lineTo(e.clientX - tool_rect.left, e.clientY - tool_rect.top);
        tool.strokeStyle=selected_colour;
        tool.lineWidth=selected_width;
        tool.stroke();

        let obj={
            id:"mm",
            x:e.clientX - tool_rect.left,
            y:e.clientY - tool_rect.top,
            color:tool.strokeStyle,
            width:tool.lineWidth,
        }
    
        undo.push(obj);
    }
})