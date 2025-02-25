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
            // Tìm tất cả các số trong chuỗi (số cột của hàng này)
            let numbers = str.match(/\d+/g);
            if (!numbers) continue; // Nếu không có số nào, bỏ qua hàng này.

            // Duyệt qua từng số trong chuỗi (mỗi số đại diện cho một prefab index)
            for (let col = 0; col < numbers.length; col++) {
                let num = numbers[col];
                let index = parseInt(num);
                // Kiểm tra xem index có hợp lệ không
                if (index >= 0 && index < this.listSpawner.length) {
                    let prefab = this.listSpawner[index];
                    let newNode = cc.instantiate(prefab);

                    let posX = startX + col * spacingX;
                    let posY = startY - row * spacingY;
                    newNode.setPosition(cc.v2(posX, posY));

                    // Thêm newNode vào containerNode
                    this.node.addChild(newNode);
                } 
            }
        }
    }
  
});
module.exports=ManagerSpawner;
