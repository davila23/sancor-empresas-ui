export function reverseDate(val: string) {
    if (typeof val === 'string') {
        return val.split('/').length === 3 ? val.split('/').reverse().join('/') : '';
    }
}
