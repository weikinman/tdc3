class EntityManager{
    private entitys:any[]
    constructor(){
        this.entitys = [];
    }
    public add(entity){
        this.entitys.push(entity);
    }

    public getEntitys(){
        return this.entitys;
    }
}


export const entityManager = new EntityManager();

export function AddEntity(opts?){

    return function(target?,props?){
        entityManager.add({
            target:target,
            name:props,
            opts,
            type:opts.type,
            length:opts.length
        })
        // console.log('entityManager',entityManager.getEntitys(),target,props,opts)
    }
}