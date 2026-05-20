//Importa herramientas de Express y Zod para manejar peticiones y validar datos.//
//Express (req, res, next) , donde req es la petición, res es la respuesta y next es una
//  función que se llama para pasar al siguiente middleware o controlador.//
//Zod (validaciones y errores)
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
//-------------------------------------------------------------------------------------------------------------
//Crea una función que recibe un esquema de validación (schema) y devuelve un middleware de Express.
//  Este middleware intentará validar el cuerpo de la petición (req.body) utilizando el esquema proporcionado. 
export const validateTask = (schema: AnyZodObject) => {
//-------------------------------------------------------------------------------------------------------------
//Define el middleware que trabajará con:
//petición (req)
//respuesta (res)
//siguiente función (next)
// req, res y next son objetos y funciones de Express que permiten manejar las peticiones y respuestas 
// dentro del servidor.
//req obtiene los datos enviados por el cliente, res envía una respuesta al cliente y next continúa con 
// el siguiente middleware o controlador de la aplicación.
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
//------------------------------------------------------------------------------------------------------------
//Valida los datos enviados por el cliente.
//Revisa si los datos enviados son correctos.
//Si son correctos, continúa al siguiente controlador. (//Si están bien → continúa con next().)
//Si son correctos, continúa al siguiente controlador.
            schema.parse(req.body);
            next(); 
        } catch (error) {
//------------------------------------------------------------------------------------------------------------
//Si los datos son incorrectos:
//devuelve error 400
//muestra qué campo falló y el mensaje del error.
            if (error instanceof ZodError) {
                res.status(400).json({
                    status: "error_validacion",
                    errors: error.errors.map(err => ({
                        campo: err.path[0],
                        mensaje: err.message
                    }))
                });
                return;
            }
            next(error); 
        }
    };
};
// Y ya estaria.
