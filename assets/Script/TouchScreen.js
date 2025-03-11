cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
        touchLayerNode: cc.Node, 
        targetObjects: cc.Node 
    },

    onLoad() {
        this.touchLayerNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        for (let i = 0; i < this.targetObjects.children.length; i++) {
            const obj = this.targetObjects.children[i];
            this.addBoundingBox(obj);
        }
    },
    onTouchStart(event) {
        const touchPos = event.getLocation();
        const ray = this.screenPointToRay(touchPos);
        this.checkRaycast(ray);
    },

    screenPointToRay(screenPoint) {
        const camera = this.cameraNode.getComponent(cc.Camera);

        let nearVec = cc.v3();
        let farVec = cc.v3();

        camera.getScreenToWorldPoint(cc.v3(screenPoint.x, screenPoint.y, 0), nearVec);
        camera.getScreenToWorldPoint(cc.v3(screenPoint.x, screenPoint.y, 1), farVec);

        const rayDir = farVec.subtract(nearVec).normalize();

        return {
            origin: nearVec,
            direction: rayDir
        };
    },

    checkRaycast(ray) {
        let hitObject = null;

        for (let i = 0; i < this.targetObjects.children.length; i++) {
            const obj = this.targetObjects.children[i];
            const aabb = this.getBoundingBox3D(obj); 

            if (this.rayIntersectsAABB(ray.origin, ray.direction, aabb)) {
                hitObject = obj;
                break;
            }
        }

        if (hitObject) {
            const onClickObject = hitObject.getComponent('OnClickObject');
            onClickObject.HandleClickObject();
        } 
    },

    getBoundingBox3D(node) {
        const size = cc.v3(0.4, 0.4, 0.4); 
        const scale = node.scale; 
        const halfSize = size.mul(scale).mul(0.5);

        const worldPos = node.convertToWorldSpaceAR(cc.Vec3.ZERO);

        return {
            min: worldPos.sub(halfSize),
            max: worldPos.add(halfSize)
        };
    },
    
    addBoundingBox(node) {
        let collider = node.getComponent(cc.BoxCollider3D);
        if (!collider) {
            collider = node.addComponent(cc.BoxCollider3D);
        }
        collider.size = cc.v3(0.5, 0.5, 0.5); 
        collider.center = cc.v3(0, 0, 0);   
    },
    

    rayIntersectsAABB(origin, direction, aabb) {
        let tmin = (aabb.min.x - origin.x) / direction.x;
        let tmax = (aabb.max.x - origin.x) / direction.x;

        if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

        let tymin = (aabb.min.y - origin.y) / direction.y;
        let tymax = (aabb.max.y - origin.y) / direction.y;

        if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

        if ((tmin > tymax) || (tymin > tmax))
            return false;

        if (tymin > tmin) tmin = tymin;
        if (tymax < tmax) tmax = tymax;

        let tzmin = (aabb.min.z - origin.z) / direction.z;
        let tzmax = (aabb.max.z - origin.z) / direction.z;

        if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

        if ((tmin > tzmax) || (tzmin > tmax))
            return false;

        return true;
    }
});
