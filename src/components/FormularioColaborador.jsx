import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alert from "../components/Alert";

const FormularioColaborador = () => {
  const [email, setEmail] = useState("");
  const { alerta, setAlerta, submitColaborador } = useProyectos();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      setAlerta({
        msg: "El email es obligatorio",
        error: true,
      });
    }
    setTimeout(() => {
      setAlerta({});
    }, 6000);
    submitColaborador(email);
  };

    const { msg } = alerta;
  return (
    <form
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full"
      onSubmit={handleSubmit}
    >
        {msg && <Alert alerta={alerta} />}
      <div className="mb-5">
        <label
          htmlFor="email"
          className="text-gray-700 uppercase font-bold text-sm "
        >
          Email Colaborador
        </label>
        <input
          type="email"
          id="email"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Email del Usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <input
        type="submit"
        value="Buscar Colaborador"
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  );
};

export default FormularioColaborador;
