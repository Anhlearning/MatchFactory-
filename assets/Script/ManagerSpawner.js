// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const ManagerSpawner=cc.Class({
    extends: cc.Component,

    properties: {
        listSpawner:{
            default:[],
            type:cc.Prefab
        },  
        nodeStringList:{
            default:[],
            type:[cc.String]
        },

    },
    statics: {
        instance: null,
    },    
    onLoad(){
        ManagerSpawner.instance=this;
        this.maxdistanceY=0;
    },
    start () {
        this.spawnObject();
    },
    spawnObject(){
        if(this.listSpawner.length==0){
            return;
        }
        let heightframe = cc.winSize.height;
        let widthframe = cc.winSize.width;
        console.log(widthframe);
        let startX = -widthframe / 2 + 175;
        let startY = heightframe / 2 + 200;

        let spacingX = 150;
        let spacingY = 180;

        for(let row = 0; row < this.nodeStringList.length; row++){
            let str = this.nodeStringList[row];
            let numbers = str.match(/\d+/g);
            if (!numbers) continue;
            for (let col = 0; col < numbers.length; col++) {
                let num = numbers[col];
                let index = parseInt(num);
                if (index >= 0 && index < this.listSpawner.length) {
                    let prefab = this.listSpawner[index];
                    let newNode = cc.instantiate(prefab);

                    let posX = startX + col * spacingX;
                    let posY = startY - row * spacingY;
                    this.maxdistanceY=Math.max(posY,this.maxdistanceY);
                    newNode.setPosition(cc.v2(posX, posY));
                    this.node.addChild(newNode);
                } 
            }
        }
    },
    SpawnObjectSingle(posX) {
        // Kiểm tra listSpawner có phần tử nào không
        if (this.listSpawner.length === 0) {
            cc.error("listSpawner is empty!");
            return;
        }
    
        let randomIndex = Math.floor(Math.random() * this.listSpawner.length);
    
        // Lấy prefab từ danh sách
        let prefab = this.listSpawner[randomIndex];
    
        // Tạo một object từ prefab
        let newNode = cc.instantiate(prefab);
    
        // Đặt vị trí cho object spawn
        newNode.setPosition(cc.v2(posX, this.maxdistanceY+180));
    
        // Thêm vào scene
        this.node.addChild(newNode);
    },
    
    
});
module.exports=ManagerSpawner;
