import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import {
	Container,
	Title,
	Text,
	TextInput,
	PasswordInput,
	Button,
	Paper
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { authService } from "../../services/authService";

const UserSchema = z.object({
	name: z
		.string("Ingresa un nombre válido")
		.min(4, "Debe tener mínimo 4 caracteres")
		.max(32, "Debe tener máximo 32 caracteres"),
	email: z
		.email("El correo electrónico no es válido")
		.max(48, "Debe tener máximo 48 caracteres"),
	password: z
		.string("La contraseña no es válida")
		.min(4, "Debe tener mínimo 4 caracteres")
		.max(32, "Debe tener máximo 32 caracteres"),
});

export function RegisterPage() {
	const form = useForm({
		resolver: zodResolver(UserSchema),
	});
	const navigate = useNavigate();
	const [error, setError] = useState(undefined);

	async function onSubmit(formData) {
		try {
			setError(undefined);
			const formDataJson = JSON.stringify(formData);
			const response = await authService.register(formDataJson);
			if (response.status === 200) navigate("/cliente");
			else throw new Error("Ocurrió un error inesperado");
		} catch (error) {
			setError(error.message);
		}
	}

	return (
		<main className="wrapper">
			<Paper className="form" radius="lg" >
				<Title order={2} className="title">
					Completa los campos para agregar un nuevo sector
					</Title>
			
					<form>
						<TextInput
							label="Nombre"
							placeholder="Nombre"
							error={form.formState.errors.name?.message}
							{...form.register("name")}
							size="md"
							radius="md"
						/>
						<TextInput
							label="Correo electrónico"
							placeholder="usuario@gmail.com"
							error={form.formState.errors.email?.message}
							{...form.register("email")}
							size="md"
							radius="md"
						/>
						<PasswordInput
							label="Contraseña"
							placeholder="Contraseña"
							error={form.formState.errors.password?.message}
							{...form.register("password")}
							size="md"
							radius="md"
						/>
						{error ? <p className="errorMessage">{error}</p> : null}
						<Button
							fullWidth
							mt="xl"
							size="md"
							radius="md"
							variant="filled"
							onClick={form.handleSubmit(onSubmit)}
							loading={form.formState.isSubmitting}
						>
							Crear nuevo sector
						</Button>
				
					</form>
			
			</Paper>
		</main>
	);
}