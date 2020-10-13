export interface View<T> {
    render(obj: T): any
    renderMany(obj: T[]): any[]
}


export function createView<T>(render: (obj: T) => any): View<T> {
    return {
        render,
        renderMany(obj) {
            return obj.map(render)
        } 
    }
}