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
        liststack: [cc.Node],
    },
    statics: {
        instance: null,
    },    
    onLoad(){
        ManagerSpawner.instance=this;
        this.mindistanceZ=0;
    },
    start () {
        this.spawnObject();
        //this.showStackWithEffect();
    },
    showStackWithEffect() {
        if (!this.liststack || this.liststack.length === 0) {
            return;
        }
    
        let delayBetween = 0.1; // Mỗi object trễ 0.1s
        this.liststack.forEach((node, index) => {
            node.opacity = 0;  // Ẩn ban đầu
            node.scale = 0.5;  // Nhỏ lại để có cảm giác phóng to
    
            cc.tween(node)
                .delay(index * delayBetween) // Càng sau càng delay nhiều
                .to(0.3, { opacity: 255, scale: 1.0 }, { easing: 'backOut' }) // Phóng to và hiện dần
                .to(0.1, { scale: 0.8 }) // Thu nhẹ lại về scale chuẩn
                .start();
        });
    },
    spawnObject() {
        if (this.listSpawner.length == 0) {
            return;
        }
    
        let heightframe = 1520;
        let spacingX = 100;  
        let spacingY = 150;  
    
        let totalCols = 0; 
        for (let row = 0; row < this.nodeStringList.length; row++) {
            let str = this.nodeStringList[row];
            let numbers = str.match(/\d+/g);
            if (numbers) {
                totalCols = Math.max(totalCols, numbers.length);
            }
        }
    
        let startX = -((totalCols - 1) * spacingX / 2);
        let startZ = -(heightframe / 2 + 300);
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
                    let posZ = startZ + row * spacingY;
                    this.mindistanceZ = Math.min(posZ, this.mindistanceZ);
    
                    // Set position 3D
                    newNode.setPosition(posX, 0, posZ);
                    // Bỏ hết hiệu ứng: opacity, scale, tween
                    this.node.addChild(newNode);
                }
            }
        }
    },
    
    SpawnObjectSingle(posX) {
        if (this.listSpawner.length === 0) {
            cc.error("listSpawner is empty!");
            return;
        }
    
        let randomIndex = Math.floor(Math.random() * this.listSpawner.length);
        let prefab = this.listSpawner[randomIndex];
    
        let newNode = cc.instantiate(prefab);
    
        // Tạo vị trí theo thế giới (world space)
        let worldPos = cc.v3(posX, 0, this.mindistanceZ);
    
        this.node.addChild(newNode);
        // Đặt vị trí theo không gian thế giới
        newNode.position=worldPos;
        console.log(this.node.position);
        newNode.setSiblingIndex(0);
    },
    
    
    
});
module.exports=ManagerSpawner;
