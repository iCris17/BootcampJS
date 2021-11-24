const paragraphs = document.getElementsByTagName("p");
console.log("Párrafos en el documento: ",paragraphs.length);

if (paragraphs.length > 0){
    const paragraph = paragraphs[0];
    paragraph.innerText = "Bienvenidos al bootcamp";
}