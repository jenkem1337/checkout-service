export default abstract class DomainException extends Error {
    constructor(errorMessage:string){
        super(errorMessage)
    }
    getMessage(){
        this.message
    }
}