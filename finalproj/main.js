"use strict;"


//All of boilerplate WebGL code from: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
function main(arr) {
  

  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  //resizes WebGL Canvas based on image width and height
  let myImg = document.getElementById("imgId");
  let width = myImg.naturalWidth
  let height = myImg.naturalHeight
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width*(600/width);
  canvas.style.height = height*(600/height);
  canvas.style.marginLeft = -width*(600/width) -4;
  myImg.remove();
  
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = arr;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2;         
  var type = gl.FLOAT;  
  var normalize = false; 
  var stride = 0;
  var offset = 0;        
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  //gl.LINES best primitive type for displaying curves constructed similarily to how we have previously in the class
  var primitiveType = gl.LINES;
  var offset = 0;
  var count = arr.length/2;
  gl.drawArrays(primitiveType, offset, count);
}
//end of WebGL boiler plate code

var b = document.getElementById('c');


function reload(event){
  
  let thr = event ? parseInt(document.getElementById("threshVal").value): 50;
  let img = document.createElement('img');
  let rads = document.getElementsByName('fileselect')
  let selected = 'cryo.gif'
  rads.forEach((btn)=>{
    if(btn.checked){
      selected = btn.value
    }
  })
  let algos = document.getElementsByName('algo')
  let selectedAlgo = 'primal'
  algos.forEach((btn)=>{
    if(btn.checked){
      selectedAlgo = btn.value
    }
  })
  img.id = 'imgId';
  img.src = selected
  document.body.appendChild(img);

  //RGBA array from image from: https://stackoverflow.com/questions/14910520/how-to-get-image-matrix-2d-using-javascript-html5
  const canvas = document.getElementById("canv");
  const ctx = canvas.getContext("2d");
  img.onload = () => {
    let myImg = document.getElementById("imgId");
    let width = myImg.naturalWidth
    let height = myImg.naturalHeight
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width*(600/width);
    canvas.style.height = height*(600/height);

    //puts image into canvas to read data from
    ctx.drawImage(img, 0, 0);
    let data = ctx.getImageData(0, 0, canvas.width,canvas.height).data
    let imgArr = turnToArr(myImg,data)
    let arr = selectedAlgo == 'primal' ? contourMarch(imgArr, thr): contour(imgArr,thr);
    main(arr);
  };
}

function turnToArr(img,data){
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  var arr = new Array(width);
  for(let i = 0; i < width; i++){
    arr[i] = new Array(height);
  }
  for(let i = 0; i < data.length; i+=4){
    let index = i/4;
    let row = Math.floor(index/width);
    let column = index%width;
    
    if(row < arr.length && column < arr[0].length){
      arr[row][column]=data[i+2]? (data[i]+data[i+1]+data[i+2])/3:data[i];
    }
  }
  return arr;
}

function contour(img, thr){
  let indArr = new Array(img.length*2+1)
  for(let i = 0; i< indArr.length; i++){
    indArr[i]=new Array(img[0].length*2+1);
    indArr[i].fill(-1);
  }
  let verts = new Array(img.length * img[0].length)
  let edges = new Array(img.length * img[0].length)
  let vertDex = 0;
  let edgeDex = 0;
  let topLeft = 0;
  let topRight = 0;
  let botLeft = 0;
  let botRight = 0;
  let xCoord = 0;
  let yCoord = 0;
  let countX = 1;
  let countY = 1;
  let totX = 0;
  let totY = 0;
  let t = 0;
  for(let i = 0; i < img.length -1; i++){
    for(let j = 0; j < img[i].length-1; j++){
      topLeft = img[i][j] - thr;
      topRight = img[i+1][j] -thr;
      botLeft = img[i][j+1]-thr;
      botRight = img[i+1][j+1]-thr;
      if(!((topLeft>0 && topRight >0 && botLeft > 0 && botRight > 0)||
      (topLeft<=0 && topRight <= 0 && botLeft <= 0 && botRight <= 0))){
        countX=1;
        countY=1;
        totX=0;
        totY=0;
        indArr[2*i][2*j]=vertDex;
        if((topRight>0 && botRight <= 0)||(topRight<=0 && botRight > 0)){
          if(topRight<=0){
            t = topRight/(topRight - botRight); 
            totX += i + 1; 
            totY += j + t; 
            countX++; 
            countY++;
          }
          else{
            t = botRight/(botRight - topRight);
            totX += i + 1;
            totY += j + 1 - t;
            countX++;
            countY++;
          }
        }
        if((botLeft>0 && botRight <=0)||(botLeft<=0 && botRight >0)){
          if(botRight <= 0){
            t = botRight/(botRight - botLeft); 
            totX += i + 1 - t; 
            totY += j + 1; 
            countX++; 
            countY++;
          }
          else{
            t = botLeft/(botLeft - botRight);
		        totX += i + t;
            totY += j + 1;
            countX++;
            countY++;
          }
        }
        if((botLeft > 0 && topLeft <=0)||(botLeft<=0 && topLeft >0)){
          if(topLeft<=0){
            t = topLeft/(topLeft - botLeft); 
            totX += i;
            totY += j + t; 
            countX++; 
            countY++;
          }
          else{
            t = botLeft/(botLeft - topLeft);
		        totX += i;
            totY += j + 1 - t;
            countX++;
            countY++;
          }
        }
        if((topLeft > 0 && topRight <= 0) || (topLeft <= 0 && topRight > 0)){
          if(topLeft <= 0){
            t = topLeft/(topLeft - topRight); 
            totX += i + t; 
            totY += j; 
            countX++; 
            countY++;
          }
          else{
            t = topRight/(topRight - topLeft);
	          totX += i + 1 - t;
            totY += j;
            countX++;
            countY++;
          }
        }

        xCoord = totX/(countX - 1);
        yCoord = totY/(countY - 1);
        verts[vertDex] = {x: xCoord, y: yCoord};
        if(xCoord>i+5 ||yCoord>j+5||xCoord<i-5||yCoord<j-5){
          console.log(countX)
          console.log(totX)
          console.log(verts[vertDex])
        }
        vertDex++;
      }
    }
  }
  for(let i = 0; i < img.length-1; i++){
    for(let j = 0; j < img[0].length-1; j++){
      topLeft = img[i][j] - thr;
	    topRight = img[i + 1][j] - thr;
	    botLeft = img[i][j + 1] - thr;
      botRight = img[i + 1][j + 1] - thr;
      if(j!=img[i].length){
        if((topRight > 0 && botRight <= 0) || (topRight <= 0 && botRight > 0)){
          edges[edgeDex] = {p1:indArr[2*i][2*j], p2:indArr[2*(i + 1)][2*j]};
	        edgeDex++;
        }
        if((botLeft > 0 && botRight <= 0) || (botLeft <= 0 && botRight > 0)){
          edges[edgeDex] = {p1:indArr[2*i][2*j], p2:indArr[2*i][2*(j + 1)]};
	        edgeDex++;
        }
      }
      else{
        edges[edgeDex] = {p1:indArr[2*i][2*j], p2:indArr[2*(i + 1)][2*j]};
	      edgeDex++;
      }
    }
  }
  return convertToVerts(verts,edges,img.length, img[0].length);
}

function contourMarch(img,thr){
  let indArr = new Array(img.length*2+1)
  for(let i = 0; i< indArr.length; i++){
    indArr[i]=new Array(img[0].length*2+1);
    indArr[i].fill(0);
  }
  let verts = new Array(img.length * img[0].length)
  let edges = new Array(img.length * img[0].length)
  let vertDex = 0;
  let edgeDex = 0;
  let topLeft = 0;
  let topRight = 0;
  let botLeft = 0;
  let botRight = 0;
  let t = 0;
  for(let i = 0; i < img.length -1; i++){
    for(let j = 0; j < img[i].length-1; j++){
      topLeft = img[i][j] - thr;
      topRight = img[i+1][j] -thr;
      botLeft = img[i][j+1]-thr;
      botRight = img[i+1][j+1]-thr;
      if(!((topLeft>0 && topRight >0 && botLeft > 0 && botRight > 0)||
      (topLeft<=0 && topRight <= 0 && botLeft <= 0 && botRight <= 0))){
        let lookup = "";
        countX=1; 
        countY=1;
        totX=0;
        totY=0;
        indArr[2*i][2*j]=vertDex;
        if((topRight>0 && botRight <= 0)||(topRight<=0 && botRight > 0)){
          lookup = lookup.concat('1')
          if(topRight<=0){
            t = topRight/(topRight-botRight);
            verts[vertDex]={x:(i+1),y:(j+t)}
            vertDex++;
          }
          else{
            t = botRight/(botRight-topRight);
            verts[vertDex]={x:(i+1),y:(j+1-t)}
            vertDex++;
          }
        }
        else{
          lookup = lookup.concat('0')
        }
        if((botLeft>0 && botRight <=0)||(botLeft<=0 && botRight >0)){
          lookup = lookup.concat('1')
          if(botRight <= 0){
            t = botRight/(botRight-botLeft);
            verts[vertDex]={x:(i+1-t),y:(j+1)}
            vertDex++;
          }
          else{
            t = botLeft/(botLeft-botRight);
            verts[vertDex]={x:(i+t),y:(j+1)}
            vertDex++;
          }
        }
        else{
          lookup = lookup.concat('0')
        }
        if((botLeft > 0 && topLeft <=0)||(botLeft<=0 && topLeft >0)){
          lookup = lookup.concat('1')
          if(topLeft<=0){
            t = topLeft/(topLeft-botLeft);
            verts[vertDex]={x:i,y:(j+t)}
            vertDex++;
          }
          else{
            t = botLeft/(botLeft-topLeft);
            verts[vertDex]={x:i,y:(j+1-t)}
            vertDex++;
          }
        }
        else{
          lookup = lookup.concat('0')
        }
        if((topLeft > 0 && topRight <= 0) || (topLeft <= 0 && topRight > 0)){
          lookup = lookup.concat('1')
          if(topLeft <= 0){
            t = topLeft/(topLeft-topRight);
            verts[vertDex]={x:(i+t),y:j}
            vertDex++;
          }
          else{
            t = topRight/(topRight-topLeft);
            verts[vertDex]={x:(i+1-t),y:j}
            vertDex++;
          }
        }
        else{
          lookup = lookup.concat('0')
        }
        switch(lookup){
          case "0011":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "0110":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "0101":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "1001":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "1010":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "1100":
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
          case "1111":
            edges[edgeDex]={p1: vertDex-4, p2:vertDex-3}
            edgeDex++;
            edges[edgeDex]={p1: vertDex-2, p2:vertDex-1}
            edgeDex++;
            break;
        }
      }
    }
  }
  return convertToVerts(verts,edges,img.length, img[0].length);
}

function convertToVerts(verts, edges, height, width){
  let counter = 0;
  let resArr = [];
  while(edges[counter]){
    if(edges[counter].p1 != -1 && edges[counter].p2 !=-1){
      let x1 = verts[edges[counter].p1].y
      let y1 = verts[edges[counter].p1].x
      let x2 = verts[edges[counter].p2].y
      let y2 = verts[edges[counter].p2].x
      resArr.push(x1*(600/width))
      resArr.push(y1*(600/height))
      resArr.push(x2*(600/width))
      resArr.push(y2*(600/height))
      
    }
    counter++;
  }
  return resArr;
}

let slider = document.getElementById("threshVal")
slider.addEventListener("change", reload)
let cryo = document.getElementById("cryo")
let brain = document.getElementById("brain")
let lesion = document.getElementById("lesion")
let primal = document.getElementById("primal")
let dual = document.getElementById("dual")

cryo.checked=true;
dual.checked=true;

cryo.addEventListener("click", reload)
brain.addEventListener("click", reload)
lesion.addEventListener("click", reload)
primal.addEventListener("click", reload)
dual.addEventListener("click", reload)
reload();
