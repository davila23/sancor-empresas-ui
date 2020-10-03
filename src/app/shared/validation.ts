export const ERROR_MESSAGES = {
    cbu: 'CBU inválido',
    cbuLength: 'El largo debe ser de 22 caracteres',
    cuit: 'CUIT inválido',
    cuitLength: 'El largo debe ser de 11 caracteres'
};

/**
 * Verifica que el valor pasado por parámetro sea un CUIT/CUIL válido
 * @param value Valor a validar
 * @returns true si es válido, string con mensaje de error si no lo es
 */
export function validarCUIT(value: string): boolean | string {
    // Debe comenzar en 20/23/27/30/33
    // Si el jj es 10 debe comenzar en 23 o 33
    const cuitsposibles = [20, 23, 24, 27, 30, 33, 34];
    let error = '';
    let reto =
        Number.parseInt(value.substr(10, 1), 10) * 2 +
        Number.parseInt(value.substr(9, 1), 10) * 3 +
        Number.parseInt(value.substr(8, 1), 10) * 4 +
        Number.parseInt(value.substr(7, 1), 10) * 5;
    reto +=
        Number.parseInt(value.substr(6, 1), 10) * 6 +
        Number.parseInt(value.substr(5, 1), 10) * 7 +
        Number.parseInt(value.substr(4, 1), 10) * 2 +
        Number.parseInt(value.substr(3, 1), 10) * 3;
    reto += Number.parseInt(value.substr(1, 1), 10) * 4 + Number.parseInt(value.substr(0, 1), 10) * 5;
    let jj = reto % 11;
    if (jj !== 0) {
        jj = 11 - jj;
    }
    if (value.length !== 13) {
        error = 'cuitLength';
    } else if (jj === 10 || cuitsposibles.indexOf(Number(value.substr(0, 2))) === -1) {
        error = 'cuit';
    } else if (jj !== Number.parseInt(value.substr(12, 1), 10)) {
        error = 'cuit';
    }
    return error.length > 0 ? error : true;
}

/**
 * Verifica que el valor pasado por parámetro sea un CBU válido
 * @param value Valor a validar
 * @returns true si es válido, string con mensaje de error si no lo es
 */
export function validarCBU(value: string): boolean | string {
    if (value.length !== 22) {
        return 'cbuLength';
    }
    const veri1 = '7139713';
    const veri2 = '3971397139713';
    let suma1 = 0;
    let suma2 = 0;
    let sm1 = '';
    let sm2 = '';
    const bloque1 = value.substr(0, 7);
    const dveri1 = value.substr(7, 1);
    const bloque2 = value.substr(8, 13);
    const dveri2 = value.substr(21, 1);
    for (let i = 0; i < veri1.length; i++) {
        suma1 += Number.parseInt(veri1.substr(i, 1), 10) * Number.parseInt(bloque1.substr(i, 1), 10);
    }
    sm1 = suma1.toString();
    let xveri1 = 10 - Number.parseInt(sm1.substr(sm1.length - 1, 1), 10) * 1;
    if (xveri1 === 10) {
        xveri1 = 0;
    }
    for (let i = 0; i < veri2.length; i++) {
        suma2 += Number.parseInt(veri2.substr(i, 1), 10) * Number.parseInt(bloque2.substr(i, 1), 10);
    }
    sm2 = suma2.toString();
    let xveri2 = 10 - Number.parseInt(sm2.substr(sm2.length - 1, 1), 10) * 1;
    if (xveri2 === 10) {
        xveri2 = 0;
    }
    if (Number.parseInt(dveri1, 10) !== xveri1 || Number.parseInt(dveri2, 10) !== xveri2) {
        return 'cbu';
    }
    return true;
}
