
/**
 * 
 * @param _ //not used
 * @param _2 //not used
 * @param descriptor 
 */
 export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn
        },
    };
    return adjDescriptor;
}