import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import {
	Container,
	Title,
	Text,
	TextInput,
	PasswordInput,
	Button,
	Paper,
	Checkbox,
	Modal
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
	admin: z.boolean() // <-- agregamos el campo admin
});

export function RegisterPage() {
	const form = useForm({
		resolver: zodResolver(UserSchema),
		defaultValues: { admin: false } // por defecto no admin
	});

	const navigate = useNavigate();
	const [error, setError] = useState(undefined);
	const [confirmAdminModal, setConfirmAdminModal] = useState(false);

	// Cuando se marca admin, mostramos modal
	function handleAdminToggle(e) {
		const checked = e.currentTarget.checked;

		if (checked) {
			// Mostrar modal de confirmación
			setConfirmAdminModal(true);
		} else {
			// Si desmarca, simplemente actualizar
			form.setValue("admin", false);
		}
	}

	// Aceptar modal → confirmar admin = true
	function confirmAdmin() {
		form.setValue("admin", true);
		setConfirmAdminModal(false);
	}

	// Cancelar modal → volver admin = false
	function cancelAdmin() {
		form.setValue("admin", false);
		setConfirmAdminModal(false);
	}

	async function onSubmit(formData) {
		try {
			setError(undefined);

			const response = await authService.register(formData);

			if (response.status === 200) navigate("/home");
			else throw new Error("Ocurrió un error inesperado");

		} catch (error) {
			setError(error.message);
		}
	}

	return (
		<main className="wrapper">
			<Paper className="form" radius="lg" >
				<Title order={2} className="title">
					Registrar nuevo Usuario!
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

					{/* CHECKBOX ADMIN */}
					<Checkbox
						mt="md"
						label="¿Es administrador?"
						checked={form.watch("admin")}
						onChange={handleAdminToggle}
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
						Registrar nuevo Usuario!
					</Button>
				</form>
			</Paper>

			{/* MODAL DE CONFIRMACIÓN */}
			<Modal
				opened={confirmAdminModal}
				onClose={cancelAdmin}
				title="Confirmar administrador"
				centered
			>
				<Text>
					Estás por marcar a este usuario como <strong>administrador</strong>.  
					Esto le dará acceso completo al sistema.
				</Text>

				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10 }}>
					<Button variant="outline" color="gray" onClick={cancelAdmin}>
						Cancelar
					</Button>
					<Button color="red" onClick={confirmAdmin}>
						Confirmar
					</Button>
				</div>
			</Modal>
		</main>
	);
}
