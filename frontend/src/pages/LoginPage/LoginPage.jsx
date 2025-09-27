import {
    Anchor,
    Button,
    Checkbox,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/authService";
import { useState } from "react";
import classes from './LoginPage.module.css';
import { Link, useNavigate } from "react-router";

const UserSchema = z.object({
    email: z
        .email("El Correo electrónico no es válido")
        .max(48, "Debe tener máximo 48 caracteres"),
    password: z
        .string("La contraseña no es válida")
        .min(4, "La contraseña debe tener al menos 8 caracteres")
        .max(32, "La contraseña debe tener máximo 32 caracteres")
});

export function LoginPage() {
    const form = useForm({
        resolver: zodResolver(UserSchema),
    });

    const navigate = useNavigate();
    const [error, setError] = useState(undefined);

    async function onSubmit(formData) {
        try {
            setError(undefined); // Eliminar cualquier error previo

            const formDataJson = JSON.stringify(formData);
            const response = await authService.login(formDataJson);

            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                navigate("/cliente");
            } else {
                throw new Error("Ocurrió un error inesperado");
            }
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <>

            <div className={classes.wrapper}>
                <Paper className={classes.form} radius="lg">
                    <Title order={2} className={classes.title}>
                        Bienvenido a Ortiz Hnos!
                    </Title>

                    <TextInput label="Email" placeholder="usuario@gmail.com"
                        size="md" radius="md"
                        error={form.formState.errors.email?.message}
                        {...form.register("email")}
                    />
                    <PasswordInput label="Contraseña" placeholder="Contraseña"
                        mt="md" size="md" radius="md"
                        error={form.formState.errors.password?.message}
                        {...form.register("password")}
                    />
                    {error ? <p className="errorMessage">{error}</p> : null}

                    <Button fullWidth mt="xl" size="md" radius="md"
                        variant="filled"
                        onClick={form.handleSubmit(onSubmit)}
                        loading={form.formState.isSubmitting}>
                        Iniciar sesión
                    </Button>

                </Paper>
            </div>
        </>
    );
}