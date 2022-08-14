const bcryptjs = require('bcryptjs');
const transporter = require("./sendEmail");
const helpers = {};

/**
 * Encripta la contraseña
 */
helpers.encryptPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    return hash;
};

/**
 * Envia un correo electronico
 * @param {correo al que se enviara el mensaje} emailDestiny 
 * @param {contraseña por defecto creada por el sistema} password_user 
 */
helpers.sendEmail = async (emailDestiny, password_user, id_user) => {
    let info = await transporter.sendMail({
        from: '"Save your links" <camiloaaguilara@gmail.com>', // sender address
        to: emailDestiny, // list of receivers
        subject: "Actualizar contraseña", // Subject line
        html: `
            <h1>Configuración de seguridad</h1>
            <p>
                Ya casi terminas, solo te falta configurar una contraseña,
                el sistema por defecto te ha asignado la contraseña de "${password_user}",
                pero te recomiendo que cambies tu contraseña para poder hacer uso de nuestros
                servicios, muchas gracias.
            </p>
            <br>
            <a href="http://localhost:4000/updatePass/${id_user}">Click aquí para actualizar la contraseña.</a>`
    });
};

/**
 * Correo para solicitud de cambio de contraseña
 * @param {*} emailDestiny 
 * @param {*} id_user 
 */
helpers.newPasswordSolicitude = async (emailDestiny, id_user) => {
    let info = await transporter.sendMail({
        from: '"Save your links" <camiloaaguilara@gmail.com>', // sender address
        to: emailDestiny, // list of receivers
        subject: "Cambiar contraseña", // Subject line
        html: `
            <h1>Recuperacion de contraseña</h1>
            <br>
            <a href="http://localhost:4000/updatePass/${id_user}">Click aquí para recuperar la contraseña.</a>`
    });
};

helpers.sendEmailWelcome = async (emailDestiny, password_user) => {
    let info = await transporter.sendMail({
        from: '"Save your links" <camiloaaguilara@gmail.com>', // sender address
        to: emailDestiny, // list of receivers
        subject: "Bienvenido", // Subject line
        html: `
            <h1>Bienvenido</h1>
            <br>
            <p>
                Espero que tu experiencia usando nuestros servicios sea la mejor, tu
                contraseña es ${password_user}, eventualmente se te pedirá actualizarla.
            </p>`
    });
};

/**
 * Compara la contraseña en el inicio de sesion
 */
helpers.comparePassword = async (password, savepassword) => {
    try {
        return await bcryptjs.compare(password, savepassword);
    } catch (e) {
        console.error(e);
    }
};

/**
 * Veridica que una cadena tenga numeros
 * @param {} word 
 */
helpers.hasNumbers = (word) => {
    for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i).charCodeAt(0);
        if (letter >= 48 && letter <= 57) {
            return true;
        }
    }
    return false;
}

/**
 * Veridica que una cadena tenga letras
 * @param {} word 
 */
 helpers.hasLetters = (word) => {
    for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i).charCodeAt(0);
        if ((letter >= 65 && letter <= 90) || (letter >= 97 && letter <= 122)) {
            return true;
        }
    }
    return false;
}

/**
 * verifica que una cadena tenga caracteres especiales
 * @param {cadena} word 
 * @returns 
 */
helpers.hasSpecialChars = (word) => {
    for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i).charCodeAt(0);
        if (letter >= 32 && letter <= 47) {
            return true;
        }
        if (letter >= 58 && letter <= 64) {
            return true;
        }
        if (letter >= 91 && letter <= 96) {
            return true;
        }
        if (letter >= 123) {
            return true;
        }
    }
    return false;
}

module.exports = helpers;