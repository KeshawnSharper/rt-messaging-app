export const makeFirebaseErrorString = (string) => {
    let newString = string
    newString = newString.slice(5).replace(/[\W_]+/g," ")
    let result = newString[0].toUpperCase()
    for (let i = 1; i < newString.length;i++){
            result += newString[i-1] === " " ? newString[i].toUpperCase() : newString[i]
    }
    return result
}

