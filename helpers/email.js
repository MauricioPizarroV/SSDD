import nodemailer from 'nodemailer'


const emailRegistro = async(datos) => {
    //en esta parte es donde se configuran los datos para poder enviar el mail
    // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const {email, nombre, token} = datos

        //Enviar el email
        await transport.sendMail({
            from: 'SSDD',
            to: email,
            subject: 'Confirma tu cuenta en SSDD Control e inventario ',
            text: 'Confirma tu cuenta en SSDD Control e inventario ',
            html: `
                <p>Hola ${nombre}, comprueba tu cuenta en SSDD Control e inventario

                <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta </a> </p>

                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            `
        })
}

const emailOlvidePassword = async(datos) => {
    //en esta parte es donde se configuran los datos para poder enviar el mail
    // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const {email, nombre, token} = datos

        //Enviar el email
        await transport.sendMail({
            from: 'SSDD',
            to: email,
            subject: 'Reestablecer contraseña de tu cuenta ',
            text: 'Reestablece tu contraseña en nuestro sitio',
            html: `
                <p>Hola ${nombre}, reestablece tu constraseña en SSDD Inventario y Control

                <p>Para reestablecer tu contraseña debes ingresar en el siguiente enlace: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password </a> </p>

                <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
            `
        })
}


export{
    emailRegistro,
    emailOlvidePassword,
}