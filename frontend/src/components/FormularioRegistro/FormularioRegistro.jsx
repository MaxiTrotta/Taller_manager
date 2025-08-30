import React, { useState } from 'react';
import "./FormularioRegistro.css";

const FormularioRegistro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    marca: '',
    modelo: '',
    patente: '',
    descripcion: '',
    prioridad: 'media',
    fecha_ingreso: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora mostramos los datos en consola
    console.log('Datos enviados:', formData);

    // En el futuro:
    // fetch('http://localhost:8080/api/registro.php', { method: 'POST', body: JSON.stringify(formData) })
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Registro de reparación</h2>

      <h3>Cliente</h3>
      <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
      <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
      <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />

      <h3>Vehículo</h3>
      <input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} required />
      <input type="text" name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} required />
      <input type="text" name="patente" placeholder="Patente" value={formData.patente} onChange={handleChange} required />

      <h3>Arreglo</h3>
      <textarea name="descripcion" placeholder="Descripción del arreglo" value={formData.descripcion} onChange={handleChange} required />
      
      <select name="prioridad" value={formData.prioridad} onChange={handleChange}>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>

      <input type="date" name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} required />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default FormularioRegistro;
