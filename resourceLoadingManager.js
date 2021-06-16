
class Resources {
    
    allImages = []
    loadedImagesCount = 0
    pawnWImage = new Image();
    pawnBImage = new Image();
    rookWImage = new Image();
    rookBImage = new Image();
    bishopWImage = new Image();
    bishopBImage = new Image();
    knightWImage = new Image();
    knightBImage = new Image();
    queenWImage = new Image();
    queenBImage = new Image();
    kingWImage = new Image();
    kingBImage = new Image();

    constructor(){
        var thisObject = this
        this.allImages.push(this.pawnWImage);
        this.pawnWImage.src = "resources/pawnW.svg"
        this.allImages.push(this.pawnBImage);
        this.pawnBImage.src = "resources/pawnB.svg"
        this.allImages.push(this.rookWImage);
        this.rookWImage.src = "resources/rookW.svg"
        this.allImages.push(this.rookBImage);
        this.rookBImage.src = "resources/rookB.svg"
        this.allImages.push(this.bishopWImage);
        this.bishopWImage.src = "resources/bishopW.svg"
        this.allImages.push(this.bishopBImage);
        this.bishopBImage.src = "resources/bishopB.svg"
        this.allImages.push(this.knightWImage);
        this.knightWImage.src = "resources/knightW.svg"
        this.allImages.push(this.knightBImage);
        this.knightBImage.src = "resources/knightB.svg"
        this.allImages.push(this.queenWImage);
        this.queenWImage.src = "resources/queenW.svg"
        this.allImages.push(this.queenBImage);
        this.queenBImage.src = "resources/queenB.svg"
        this.allImages.push(this.kingWImage);
        this.kingWImage.src = "resources/kingW.svg"
        this.allImages.push(this.kingBImage);
        this.kingBImage.src = "resources/kingB.svg"
        this.pawnWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.pawnBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.rookWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.rookBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.bishopWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.bishopBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.knightWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.knightBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.queenWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.queenBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.kingWImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
        this.kingBImage.onload = function(){
            thisObject.onAllImagesLoaded()
        }
    }

    onAllImagesLoaded() {
        this.loadedImagesCount++
        if(this.allImages.length == this.loadedImagesCount){
             setupContentView(globalBoard,window.innerWidth, window.innerHeight)
        }
    }
}
