import {
    Button,
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
import { useNavigate } from "react-router";

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';


// 🔹 SCHEMA de validación (Zod)
const UserSchema = z.object({
    email: z
        .email("El correo electrónico no es válido")
        .max(48, "Debe tener máximo 48 caracteres"),
    password: z
        .string("La contraseña no es válida")
        .min(4, "La contraseña debe tener al menos 4 caracteres")
        .max(32, "La contraseña debe tener máximo 32 caracteres"),
});


export function LoginPage() {

    const form = useForm({
        resolver: zodResolver(UserSchema),
    });

    const navigate = useNavigate();
    const [error, setError] = useState(undefined);

    // 🔹 SUBMIT PRINCIPAL
    async function onSubmit(formData) {
        try {
            setError(undefined);

            const response = await authService.login(formData);

            const token = response.data.token;
            const admin = response.data.admin;
            const name = response.data.name;


            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("admin", admin);
                if (name) {
                    localStorage.setItem("userName", name);
                }
            }
            // Guardamos en localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("admin", admin);

            // Redirección por rol
            if (admin === 1) {
                navigate("/home");
            } else {
                navigate("/mecanico");
            }

        } catch (err) {
            setError(err.message || "Error al intentar iniciar sesión");
        }
    }


    return (
        <div className={classes.wrapper}>

            {/* VIDEO */}
            <div className={classes.videoWrapper}>
                <LiteYouTubeEmbed
                    id="BkBkN5-x3ss"
                    title="Video de bienvenida a Ortiz Hnos"
                    poster="maxresdefault"
                    autoplay
                    muted
                    alwaysLoadIframe
                    noCookie
                    params="autoplay=1&mute=1&loop=1&playlist=BkBkN5-x3ss&controls=0&showinfo=0&modestbranding=1&rel=0"
                    iframeClass={classes.videoIframe}
                />
            </div>

            {/* FORMULARIO */}
            <div className={classes.formWrapper}>
                <Paper className={classes.form} radius="lg">

                    <Title order={2} className={classes.title}>
                        Bienvenido a Ortiz Hnos!
                    </Title>


                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <TextInput label="Email" placeholder="usuario@gmail.com"
                                size="md" radius="md"
                                error={form.formState.errors.email?.message}
                                {...form.register("email")}
                            />
                            <PasswordInput label="Contraseña" placeholder="Contraseña"
                                mt="md" size="md" radius="md"
                                error={form.formState.errors.password?.message}
                                {...form.register("password")}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)();
                                    }
                                }}
                            />
                            {error ? <p className="errorMessage">{error}</p> : null}

                            <Button 
                                fullWidth 
                                mt="xl" 
                                size="md" 
                                radius="md"
                                variant="filled"
                                type="submit"
                                loading={form.formState.isSubmitting}>
                                Iniciar sesión
                            </Button>
                        </form>

                </Paper>
            </div>

        </div>
    );
}
