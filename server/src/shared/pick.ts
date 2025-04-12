const pick = <T, K extends keyof T>(obj: T, keys: K[]): pertial<T> => {
    const finalObj: Partial<T> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key]
        }
    }

    console.log(finalObj);
    return finalObj;

}