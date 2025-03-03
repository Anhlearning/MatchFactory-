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
        stack:cc.Node,

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
    spawnObject() {
        if (this.listSpawner.length == 0) {
            return;
        }
        
        let heightframe = cc.winSize.height;
    
        let spacingX = 150;
        let spacingY = 180;
    
        let totalCols = 0; 
        for (let row = 0; row < this.nodeStringList.length; row++) {
            let str = this.nodeStringList[row];
            let numbers = str.match(/\d+/g);
            if (numbers) {
                totalCols = Math.max(totalCols, numbers.length);
            }
        }
        
        let startX = -((totalCols - 1) * spacingX / 2);
        let startY = heightframe / 2 + 200;
    
        let spawnDelay = 0; // Delay để từng node ra hiệu ứng nối tiếp đẹp hơn
    
        for (let row = 0; row < this.nodeStringList.length; row++) {
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
    
                    this.maxdistanceY = Math.max(posY, this.maxdistanceY);
                    newNode.setPosition(cc.v2(posX, posY));
    
                    newNode.opacity = 0;   // Ẩn ban đầu
                    newNode.scale = 0.1;   // Scale cực nhỏ ban đầu (xa ra)
    
                    this.node.addChild(newNode);
    
                    cc.tween(newNode)
                        .delay(spawnDelay)  // Delay nhẹ tạo hiệu ứng lần lượt
                        .to(0.4, { opacity: 255, scale: 0.35, angle: 360 }, { easing: 'backOut' })
                        .to(0.15, { scale: 0.3 }, { easing: 'sineOut' })  // Thu về kích thước chuẩn
                        .start();
    
                    spawnDelay += 0.025; // Mỗi node sau ra trễ thêm chút
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
    

        let newNode = cc.instantiate(prefab);

        newNode.setPosition(cc.v2(posX, this.maxdistanceY+180));
    
        // Thêm vào scene
        this.node.addChild(newNode);
    },
    
    
});
module.exports=ManagerSpawner;
